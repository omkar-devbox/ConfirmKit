"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmService = exports.ConfirmService = void 0;
const create_id_1 = require("../utils/create-id");
const promise_util_1 = require("../utils/promise.util");
const queue_manager_1 = require("../queue/queue.manager");
const confirm_handler_1 = require("../lifecycle/confirm.handler");
const confirm_store_1 = require("../store/confirm.store");
const event_bus_1 = require("../events/event.bus");
const context_manager_1 = require("../context/context.manager");
/**
 * The main entry point for the confirmation dialog library.
 * Manages the high-level flow: Enqueuing -> Opening -> Executing -> Closing.
 * This class is framework-agnostic and acts as the brain of the engine.
 */
class ConfirmService {
    /** The currently active dialog item from the queue */
    activeItem = null;
    /** The context manager for the current active dialog */
    contextManager = null;
    /**
     * Display a confirmation dialog.
     * Returns a promise that resolves with the result of the user action.
     */
    async confirm(options) {
        const id = options.id || (0, create_id_1.createId)();
        const deferred = (0, promise_util_1.createDeferred)();
        // 1. Add to queue
        queue_manager_1.queueManager.enqueue({
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
    async processQueue() {
        const state = confirm_store_1.confirmStore.getState();
        // If already open or queue is empty, do nothing
        if (state.isOpen || queue_manager_1.queueManager.isEmpty() || this.activeItem) {
            return;
        }
        const next = queue_manager_1.queueManager.dequeue();
        if (!next)
            return;
        this.activeItem = next;
        const options = next.payload;
        // Initialize Context
        this.contextManager = new context_manager_1.ContextManager(options.context || {});
        // Synchronize context changes to the store
        this.contextManager.subscribe((ctx) => {
            confirm_store_1.confirmStore.updateContext(ctx);
            event_bus_1.eventBus.emit('context:update', { value: ctx, next: ctx });
        });
        // Open in store
        confirm_store_1.confirmStore.open(options, this.contextManager.get());
        // Execute onOpen hook
        options.hooks?.onOpen?.(this.contextManager.get());
        event_bus_1.eventBus.emit('confirm:open', { id: next.id, options });
    }
    /**
     * Handles a button click action.
     * This should be called by the UI renderer (React/Angular component).
     */
    async handleAction(buttonId) {
        const state = confirm_store_1.confirmStore.getState();
        if (!state.isOpen || !state.options || !this.activeItem || !this.contextManager) {
            return;
        }
        // Find button in current step or global options
        const currentStep = state.options.steps?.[state.step];
        const buttons = currentStep?.buttons || state.options.buttons;
        const button = buttons?.find(b => b.id === buttonId);
        if (!button)
            return;
        // Create action context
        const ctx = this.createActionContext(button);
        try {
            // Execute via handler (manages hooks and loading)
            await confirm_handler_1.handlerManager.execute(button, ctx);
            // Trigger role-based hooks
            if (button.role === 'confirm') {
                state.options.hooks?.onConfirm?.(button.value, this.contextManager.get());
            }
            else if (button.role === 'cancel') {
                state.options.hooks?.onCancel?.(this.contextManager.get());
            }
            // Auto-close logic
            if (button.autoClose !== false) {
                this.close(button.value);
            }
        }
        catch (error) {
            state.options.hooks?.onError?.(error, this.contextManager.get());
            // We don't necessarily close on error unless instructed
        }
    }
    /**
     * Navigate to the next step.
     */
    next() {
        const state = confirm_store_1.confirmStore.getState();
        if (state.options?.steps && state.step < state.options.steps.length - 1) {
            this.goTo(state.step + 1);
        }
    }
    /**
     * Navigate to the previous step.
     */
    back() {
        const state = confirm_store_1.confirmStore.getState();
        if (state.step > 0) {
            this.goTo(state.step - 1);
        }
    }
    /**
     * Navigate to a specific step by index or ID.
     */
    async goTo(stepIdOrIndex) {
        const state = confirm_store_1.confirmStore.getState();
        if (!state.options?.steps || !this.contextManager)
            return;
        let targetIndex = -1;
        if (typeof stepIdOrIndex === 'number') {
            targetIndex = stepIdOrIndex;
        }
        else {
            targetIndex = state.options.steps.findIndex(s => s.id === stepIdOrIndex);
        }
        if (targetIndex >= 0 && targetIndex < state.options.steps.length) {
            // Hook: beforeStepChange
            const canChange = await state.options.hooks?.beforeStepChange?.(state.step, targetIndex, this.contextManager.get()) ?? true;
            if (canChange) {
                confirm_store_1.confirmStore.setStep(targetIndex);
                event_bus_1.eventBus.emit('confirm:step', {
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
    close(result = null) {
        const state = confirm_store_1.confirmStore.getState();
        if (!state.isOpen || !this.activeItem)
            return;
        const id = this.activeItem.id;
        const hooks = state.options?.hooks;
        const currentContext = this.contextManager?.get() || {};
        // 1. Resolve the pending promise! (CRITICAL FIX)
        this.activeItem.resolve(result);
        // 2. Perform cleanup
        this.activeItem = null;
        this.contextManager = null;
        confirm_store_1.confirmStore.close();
        // 3. Emit events and hooks
        hooks?.onClose?.(result, currentContext);
        event_bus_1.eventBus.emit('confirm:close', { id, result });
        // 4. Process next in queue
        this.processQueue();
    }
    /**
     * Close all pending and active dialogs.
     */
    closeAll() {
        queue_manager_1.queueManager.clear();
        if (this.activeItem) {
            this.close(null);
        }
    }
    /**
     * Helper to create the action context for handler execution.
     */
    createActionContext(button) {
        return {
            value: button.value,
            context: this.contextManager?.get(),
            close: (res) => this.close(res),
            next: () => this.next(),
            back: () => this.back(),
            goTo: (target) => this.goTo(target),
            updateContext: (data) => this.contextManager?.update(data),
            setLoading: (l) => confirm_store_1.confirmStore.setLoading(l),
            emit: (ev, p) => event_bus_1.eventBus.emit(ev, p),
        };
    }
}
exports.ConfirmService = ConfirmService;
/** Global singleton confirm service instance */
exports.confirmService = new ConfirmService();
