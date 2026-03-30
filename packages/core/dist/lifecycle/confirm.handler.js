"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerManager = exports.HandlerManager = void 0;
const event_bus_1 = require("../events/event.bus");
const confirm_store_1 = require("../store/confirm.store");
/**
 * Manages the execution flow of button actions, including lifecycle hooks.
 * Ensures consistent event emission and error handling.
 */
class HandlerManager {
    bus;
    executing = false;
    constructor(bus = event_bus_1.eventBus) {
        this.bus = bus;
    }
    /**
     * Executes a button's action lifecycle: beforeAction -> action -> afterAction.
     * Emits success/error events to the event bus.
     */
    async execute(button, ctx) {
        if (this.executing)
            return; // Prevent duplicate execution (debounce/lock)
        try {
            this.executing = true;
            this.bus.emit('action:start', {
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
                    confirm_store_1.confirmStore.setLoading(true);
                    await result;
                }
            }
            // after hook
            button.afterAction?.(ctx);
            // emit success
            this.bus.emit('action:success', {
                buttonId: button.id,
                value: button.value || button.id,
            });
        }
        catch (error) {
            this.bus.emit('action:error', {
                buttonId: button.id,
                error,
            });
            // Re-throw so the service can catch and potentially propagate to hooks
            throw error;
        }
        finally {
            this.executing = false;
            confirm_store_1.confirmStore.setLoading(false);
        }
    }
}
exports.HandlerManager = HandlerManager;
/** Global singleton handler manager instance */
exports.handlerManager = new HandlerManager();
