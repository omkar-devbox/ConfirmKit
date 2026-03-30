import { Subscriber, Unsubscribe, DeepReadonly } from '../types/common.types';
import { ConfirmContext } from '../types/context.types';
import { ConfirmOptions, ConfirmState } from '../types/confirm.types';
/**
 * Centralized state management for confirmation dialogs.
 * Uses a simple pub-sub system for framework-agnostic reactivity.
 */
export declare class ConfirmStore<T = any, C extends ConfirmContext = ConfirmContext> {
    private state;
    private listeners;
    constructor(initial?: Partial<ConfirmState<T, C>>);
    /**
     * Get the current state (readonly).
     */
    getState(): DeepReadonly<ConfirmState<T, C>>;
    /**
     * Update state and notify all subscribers.
     */
    private setState;
    /**
     * Notify all active subscribers with the latest state.
     */
    private notify;
    /**
     * Subscribe to full state changes.
     */
    subscribe(fn: Subscriber<DeepReadonly<ConfirmState<T, C>>>): Unsubscribe;
    /**
     * Subscribe to a specific slice of state (performance optimization).
     */
    subscribeSelector<S>(selector: (state: DeepReadonly<ConfirmState<T, C>>) => S, fn: (value: S) => void): Unsubscribe;
    /**
     * Open a new confirmation dialog.
     */
    open(options: ConfirmOptions<T, C>, context: C): void;
    /**
     * Close the current confirmation dialog and reset state.
     */
    close(): void;
    /**
     * Update the options of the currently open dialog.
     */
    updateOptions(options: Partial<ConfirmOptions<T, C>>): void;
    /**
     * Update the current context in the store.
     */
    updateContext(context: Partial<C>): void;
    /**
     * Toggle the loading state (e.g., during async actions).
     */
    setLoading(loading: boolean): void;
    /**
     * Set a specific step index.
     */
    setStep(step: number): void;
    /**
     * Reset the store to its initial state.
     */
    reset(): void;
}
/** Global singleton confirm store instance */
export declare const confirmStore: ConfirmStore<any, ConfirmContext>;
