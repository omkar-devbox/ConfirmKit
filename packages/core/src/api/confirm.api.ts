import { ConfirmOptions } from '../types/confirm.types';
import { createId } from '../utils/create-id';
import { createDeferred } from '../utils/promise.util';
import { queueManager, QueueItem } from '../queue/queue.manager';
import { handlerManager } from '../lifecycle/confirm.handler';
import { confirmStore } from '../store/confirm.store';
import { eventBus } from '../events/event.bus';
import { ContextManager } from '../context/context.manager';
import { ActionContext, ConfirmButton } from '../types/button.types';
import { ConfirmContext } from '../types/context.types';

/**
 * The main entry point for the confirmation dialog library.
 * Manages the high-level flow: Enqueuing -> Opening -> Executing -> Closing.
 * This class is framework-agnostic and acts as the brain of the engine.
 */
export class ConfirmService {
    /** The currently active dialog item from the queue */
    private activeItem: QueueItem | null = null;
    
    /** The context manager for the current active dialog */
    private contextManager: ContextManager | null = null;

    /**
     * Display a confirmation dialog.
     * Returns a promise that resolves with the result of the user action.
     */
    async confirm<T = any, C extends ConfirmContext = ConfirmContext>(
        options: ConfirmOptions<T, C>
    ): Promise<T | null> {
        const id = options.id || createId();
        const deferred = createDeferred<T | null>();

        // 1. Add to queue
        queueManager.enqueue({
            id,
            payload: options,
            resolve: deferred.resolve,
            reject: deferred.reject,
        });

        // 2. Process queue if nothing is open
        this.processQueue();

        return deferred.promise;
    }

    /**
     * Internal method to process the next item in the queue.
     */
    private async processQueue(): Promise<void> {
        const state = confirmStore.getState();
        
        // If already open or queue is empty, do nothing
        if (state.isOpen || queueManager.isEmpty() || this.activeItem) {
            return;
        }

        const next = queueManager.dequeue();
        if (!next) return;

        this.activeItem = next;
        const options = next.payload as ConfirmOptions;

        // Initialize Context
        this.contextManager = new ContextManager(options.context || {});
        
        // Synchronize context changes to the store
        this.contextManager.subscribe((ctx: any) => {
            confirmStore.updateContext(ctx as any);
            eventBus.emit('context:update', { value: ctx, next: ctx });
        });

        // Open in store
        confirmStore.open(options, this.contextManager.get() as any);
        
        // Execute onOpen hook
        options.hooks?.onOpen?.(this.contextManager.get());
        eventBus.emit('confirm:open', { id: next.id, options });
    }

    /**
     * Handles a button click action. 
     * This should be called by the UI renderer (React/Angular component).
     */
    async handleAction(buttonId: string): Promise<void> {
        const state = confirmStore.getState();
        if (!state.isOpen || !state.options || !this.activeItem || !this.contextManager) {
            return;
        }

        // Find button in current step or global options
        const currentStep = state.options.steps?.[state.step];
        const buttons = currentStep?.buttons || state.options.buttons;
        const button = buttons?.find((b: any) => b.id === buttonId);
        
        if (!button) return;

        // Create action context
        const ctx = this.createActionContext(button);

        try {
            // Execute via handler (manages hooks and loading)
            await handlerManager.execute(button, ctx);

            // Trigger role-based hooks
            if (button.role === 'confirm') {
                state.options.hooks?.onConfirm?.(button.value, this.contextManager.get());
            } else if (button.role === 'cancel') {
                state.options.hooks?.onCancel?.(this.contextManager.get());
            }

            // Auto-close logic
            if (button.autoClose !== false) {
                this.close(button.value);
            }
        } catch (error) {
            state.options.hooks?.onError?.(error, this.contextManager.get());
            // We don't necessarily close on error unless instructed
        }
    }

    /**
     * Navigate to the next step.
     */
    next(): void {
        const state = confirmStore.getState();
        if (state.options?.steps && state.step < state.options.steps.length - 1) {
            this.goTo(state.step + 1);
        }
    }

    /**
     * Navigate to the previous step.
     */
    back(): void {
        const state = confirmStore.getState();
        if (state.step > 0) {
            this.goTo(state.step - 1);
        }
    }

    /**
     * Navigate to a specific step by index or ID.
     */
    async goTo(stepIdOrIndex: string | number): Promise<void> {
        const state = confirmStore.getState();
        if (!state.options?.steps || !this.contextManager) return;

        let targetIndex = -1;
        if (typeof stepIdOrIndex === 'number') {
            targetIndex = stepIdOrIndex;
        } else {
            targetIndex = state.options.steps.findIndex((s: any) => s.id === stepIdOrIndex);
        }

        if (targetIndex >= 0 && targetIndex < state.options.steps.length) {
            // Hook: beforeStepChange
            const canChange = await state.options.hooks?.beforeStepChange?.(
                state.step, 
                targetIndex, 
                this.contextManager.get()
            ) ?? true;

            if (canChange) {
                confirmStore.setStep(targetIndex);
                eventBus.emit('confirm:step', { 
                    id: this.activeItem?.id || '', 
                    step: targetIndex, 
                    prevStep: state.step 
                });
            }
        }
    }

    /**
     * Close the current dialog with a result.
     * This resolves the promise returned by confirm().
     */
    close(result: any = null): void {
        const state = confirmStore.getState();
        if (!state.isOpen || !this.activeItem) return;

        const id = this.activeItem.id;
        const hooks = state.options?.hooks;
        const currentContext = this.contextManager?.get() || {};

        // 1. Resolve the pending promise! (CRITICAL FIX)
        this.activeItem.resolve(result);

        // 2. Perform cleanup
        this.activeItem = null;
        this.contextManager = null;
        confirmStore.close();

        // 3. Emit events and hooks
        hooks?.onClose?.(result, currentContext as any);
        eventBus.emit('confirm:close', { id, result });

        // 4. Process next in queue
        this.processQueue();
    }

    /**
     * Close all pending and active dialogs.
     */
    closeAll(): void {
        queueManager.clear();
        if (this.activeItem) {
            this.close(null);
        }
    }

    /**
     * Helper to create the action context for handler execution.
     */
    private createActionContext<T, C extends ConfirmContext>(
        button: ConfirmButton<T, C>
    ): ActionContext<T, C> {
        return {
            value: button.value as T,
            context: this.contextManager?.get() as Readonly<C>,
            close: (res?: any) => this.close(res),
            next: () => this.next(),
            back: () => this.back(),
            goTo: (target: string | number) => this.goTo(target),
            updateContext: (data: any) => this.contextManager?.update(data),
            setLoading: (l: boolean) => confirmStore.setLoading(l),
            emit: (ev: string, p?: any) => eventBus.emit(ev as any, p),
        };
    }
}

/** Global singleton confirm service instance */
export const confirmService = new ConfirmService();
