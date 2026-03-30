"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmStore = exports.ConfirmStore = void 0;
const confirm_state_1 = require("./confirm.state");
/**
 * Centralized state management for confirmation dialogs.
 * Uses a simple pub-sub system for framework-agnostic reactivity.
 */
class ConfirmStore {
    state;
    listeners = new Set();
    constructor(initial) {
        this.state = {
            ...(0, confirm_state_1.createInitialState)(),
            ...initial,
        };
    }
    /**
     * Get the current state (readonly).
     */
    getState() {
        return this.state;
    }
    /**
     * Update state and notify all subscribers.
     */
    setState(updater) {
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
     * Notify all active subscribers with the latest state.
     */
    notify() {
        const readonlyState = this.getState();
        for (const listener of this.listeners) {
            listener(readonlyState);
        }
    }
    /**
     * Subscribe to full state changes.
     */
    subscribe(fn) {
        this.listeners.add(fn);
        return () => {
            this.listeners.delete(fn);
        };
    }
    /**
     * Subscribe to a specific slice of state (performance optimization).
     */
    subscribeSelector(selector, fn) {
        let prev = selector(this.getState());
        const listener = (state) => {
            const next = selector(state);
            if (!Object.is(prev, next)) {
                prev = next;
                fn(next);
            }
        };
        return this.subscribe(listener);
    }
    /**
     * Open a new confirmation dialog.
     */
    open(options, context) {
        this.setState({
            isOpen: true,
            options,
            context,
            loading: false,
            step: 0,
        });
    }
    /**
     * Close the current confirmation dialog and reset state.
     */
    close() {
        this.setState((0, confirm_state_1.createInitialState)());
    }
    /**
     * Update the options of the currently open dialog.
     */
    updateOptions(options) {
        const currentOptions = this.state.options;
        if (!this.state.isOpen || !currentOptions)
            return;
        this.setState({
            options: {
                ...currentOptions,
                ...options,
            },
        });
    }
    /**
     * Update the current context in the store.
     */
    updateContext(context) {
        if (!this.state.isOpen || !this.state.context)
            return;
        this.setState({
            context: {
                ...this.state.context,
                ...context,
            },
        });
    }
    /**
     * Toggle the loading state (e.g., during async actions).
     */
    setLoading(loading) {
        this.setState({ loading });
    }
    /**
     * Set a specific step index.
     */
    setStep(step) {
        this.setState({ step });
    }
    /**
     * Reset the store to its initial state.
     */
    reset() {
        this.state = (0, confirm_state_1.createInitialState)();
        this.notify();
    }
}
exports.ConfirmStore = ConfirmStore;
/** Global singleton confirm store instance */
exports.confirmStore = new ConfirmStore();
