import { ConfirmButton, ActionContext } from '../types/button.types';
import { eventBus, EventBus } from '../events/event.bus';
import { confirmStore } from '../store/confirm.store';
import { ConfirmContext } from '../types/context.types';

/**
 * Manages the execution flow of button actions, including lifecycle hooks.
 * Ensures consistent event emission and error handling.
 */
export class HandlerManager<T = any, C extends ConfirmContext = ConfirmContext> {
    private executing = false;

    constructor(private bus: EventBus = eventBus) { }

    /**
     * Executes a button's action lifecycle: beforeAction -> action -> afterAction.
     * Emits success/error events to the event bus.
     */
    async execute(button: ConfirmButton<T, C>, ctx: ActionContext<T, C>): Promise<void> {
        if (this.executing) return; // Prevent duplicate execution (debounce/lock)

        try {
            this.executing = true;
            this.bus.emit('action:start' as any, {
                buttonId: button.id,
                value: button.value || button.id,
            });

            // before hook
            if (button.beforeAction) {
                const canProceed = await button.beforeAction(ctx);
                if (!canProceed) {
                    this.executing = false;
                    return;
                }
            }

            // main action
            if (button.action) {
                // If it's a promise, we show loading state if requested or inferred
                const result = button.action(ctx);
                if (result instanceof Promise) {
                    confirmStore.setLoading(true);
                    await result;
                }
            }

            // after hook
            button.afterAction?.(ctx);

            // emit success
            this.bus.emit('action:success' as any, {
                buttonId: button.id,
                value: button.value || button.id,
            });
        } catch (error) {
            this.bus.emit('action:error' as any, {
                buttonId: button.id,
                error,
            });
            // Re-throw so the service can catch and potentially propagate to hooks
            throw error;
        } finally {
            this.executing = false;
            confirmStore.setLoading(false);
        }
    }
}

/** Global singleton handler manager instance */
export const handlerManager = new HandlerManager();
