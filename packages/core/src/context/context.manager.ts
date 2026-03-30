import { ConfirmContext, ContextUpdater, IContextManager } from '../types/context.types';
import { DeepReadonly, Subscriber, Unsubscribe } from '../types/common.types';

/**
 * Manages shared state for a single confirmation dialog lifecycle.
 * Provides a reactive, type-safe interface for getting and updating data.
 */
export class ContextManager<C extends ConfirmContext = ConfirmContext> implements IContextManager<C> {
    private state: C;
    private initial: C;
    private listeners = new Set<Subscriber<DeepReadonly<C>>>();

    constructor(initialData: C) {
        this.initial = { ...initialData };
        this.state = { ...initialData };
    }

    /**
     * Get the current context (readonly).
     */
    get(): DeepReadonly<C> {
        return this.state as DeepReadonly<C>;
    }

    /**
     * Overwrite the entire context.
     */
    set(data: C): void {
        this.state = { ...data };
        this.notify();
    }

    /**
     * Update partial context or use an updater function.
     */
    update(updater: ContextUpdater<C>): void {
        const partial = typeof updater === 'function' 
            ? (updater as (state: C) => Partial<C>)(this.state) 
            : updater;
        
        this.state = {
            ...this.state,
            ...(partial as Partial<C>),
        };
        this.notify();
    }

    /**
     * Reset context to the values it had at initialization.
     */
    reset(): void {
        this.state = { ...this.initial };
        this.notify();
    }

    /**
     * Subscribe to context changes.
     */
    subscribe(fn: Subscriber<DeepReadonly<C>>): Unsubscribe {
        this.listeners.add(fn);
        return () => {
            this.listeners.delete(fn);
        };
    }

    /**
     * Notify all subscribers of a change.
     */
    private notify(): void {
        const current = this.get();
        for (const listener of this.listeners) {
            listener(current);
        }
    }
}
