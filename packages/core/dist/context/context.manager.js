"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextManager = void 0;
/**
 * Manages shared state for a single confirmation dialog lifecycle.
 * Provides a reactive, type-safe interface for getting and updating data.
 */
class ContextManager {
    state;
    initial;
    listeners = new Set();
    constructor(initialData) {
        this.initial = { ...initialData };
        this.state = { ...initialData };
    }
    /**
     * Get the current context (readonly).
     */
    get() {
        return this.state;
    }
    /**
     * Overwrite the entire context.
     */
    set(data) {
        this.state = { ...data };
        this.notify();
    }
    /**
     * Update partial context or use an updater function.
     */
    update(updater) {
        const partial = typeof updater === 'function'
            ? updater(this.state)
            : updater;
        this.state = {
            ...this.state,
            ...partial,
        };
        this.notify();
    }
    /**
     * Reset context to the values it had at initialization.
     */
    reset() {
        this.state = { ...this.initial };
        this.notify();
    }
    /**
     * Subscribe to context changes.
     */
    subscribe(fn) {
        this.listeners.add(fn);
        return () => {
            this.listeners.delete(fn);
        };
    }
    /**
     * Notify all subscribers of a change.
     */
    notify() {
        const current = this.get();
        for (const listener of this.listeners) {
            listener(current);
        }
    }
}
exports.ContextManager = ContextManager;
