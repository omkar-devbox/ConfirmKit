import { ConfirmContext, ContextUpdater, IContextManager } from '../types/context.types';
import { DeepReadonly, Subscriber, Unsubscribe } from '../types/common.types';
/**
 * Manages shared state for a single confirmation dialog lifecycle.
 * Provides a reactive, type-safe interface for getting and updating data.
 */
export declare class ContextManager<C extends ConfirmContext = ConfirmContext> implements IContextManager<C> {
    private state;
    private initial;
    private listeners;
    constructor(initialData: C);
    /**
     * Get the current context (readonly).
     */
    get(): DeepReadonly<C>;
    /**
     * Overwrite the entire context.
     */
    set(data: C): void;
    /**
     * Update partial context or use an updater function.
     */
    update(updater: ContextUpdater<C>): void;
    /**
     * Reset context to the values it had at initialization.
     */
    reset(): void;
    /**
     * Subscribe to context changes.
     */
    subscribe(fn: Subscriber<DeepReadonly<C>>): Unsubscribe;
    /**
     * Notify all subscribers of a change.
     */
    private notify;
}
