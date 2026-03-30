import { DeepReadonly, Subscriber, Unsubscribe } from './common.types';

/**
 * Base shared context for the dialog.
 * Can be extended with custom properties.
 */
export type ConfirmContext = Record<string, any>;

/**
 * Partial update or functional update for context.
 */
export type ContextUpdater<C extends ConfirmContext = ConfirmContext> =
    | Partial<C>
    | ((prev: Readonly<C>) => Partial<C>);

/**
 * Async context updater for API-based changes.
 */
export type AsyncContextUpdater<C extends ConfirmContext = ConfirmContext> =
    | ContextUpdater<C>
    | ((prev: Readonly<C>) => Promise<Partial<C>>);

/**
 * Interface for the Context Manager.
 */
export interface IContextManager<C extends ConfirmContext = ConfirmContext> {
    /** Get current context value */
    get(): DeepReadonly<C>;
    
    /** Set entire context (overwrites) */
    set(data: C): void;
    
    /** Update partial context or via updater function */
    update(updater: ContextUpdater<C>): void;
    
    /** Reset context to initial state */
    reset(): void;
    
    /** Subscribe to context changes */
    subscribe(fn: Subscriber<DeepReadonly<C>>): Unsubscribe;
}

/**
 * Internal event for context changes.
 */
export interface ContextEvent<C extends ConfirmContext> {
    type: 'init' | 'update' | 'reset';
    prev?: Readonly<C>;
    next: Readonly<C>;
    timestamp: number;
}
