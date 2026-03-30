"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventBus = exports.EventBus = void 0;
/**
 * Type-safe Event Bus for core library communication.
 * Prevents memory leaks by ensuring proper listener cleanup.
 */
class EventBus {
    listeners = new Map();
    /**
     * Subscribe to a specific event type.
     * Returns an unsubscribe function.
     */
    on(type, handler) {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, new Set());
        }
        const handlers = this.listeners.get(type);
        handlers.add(handler);
        return () => {
            handlers.delete(handler);
            if (handlers.size === 0) {
                this.listeners.delete(type);
            }
        };
    }
    /**
     * Emit an event with proper payload and timestamp.
     */
    emit(type, data) {
        const handlers = this.listeners.get(type);
        if (!handlers)
            return;
        const event = {
            type,
            data,
            timestamp: Date.now(),
        };
        // Execute handlers safely
        for (const handler of handlers) {
            try {
                handler(event);
            }
            catch (error) {
                console.error(`[EventBus] Error in handler for event "${type}":`, error);
            }
        }
    }
    /**
     * Clear all listeners (use with caution).
     */
    clear() {
        this.listeners.clear();
    }
}
exports.EventBus = EventBus;
/** Global singleton event bus instance */
exports.eventBus = new EventBus();
