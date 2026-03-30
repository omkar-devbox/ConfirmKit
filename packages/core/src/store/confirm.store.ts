import { createInitialState } from './confirm.state';
import { ConfirmState } from '../types/confirm.types';
import { ConfirmContext } from '../types/context.types';

/**
 * Centralized state management for confirmation dialogs.
 * Uses a simple pub-sub system for framework-agnostic reactivity.
 */
export class ConfirmStore<T = any, C extends ConfirmContext = ConfirmContext> {
    private state: ConfirmState<T, C>;
    private listeners = new Set<(state: ConfirmState<T, C>) => void>();

    constructor(initial?: Partial<ConfirmState<T, C>>) {
        this.state = {
            ...createInitialState<T, C>(),
            ...initial,
        } as ConfirmState<T, C>;
    }

    /**
     * Get the current state (readonly).
     */
    getState(): ConfirmState<T, C> {
        return this.state;
    }

    /**
     * Update state and notify all subscribers.
     */
    setState(updater: Partial<ConfirmState<T, C>> | ((state: ConfirmState<T, C>) => Partial<ConfirmState<T, C>>)): void {
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
    private notify(): void {
        const readonlyState = this.getState();
        for (const listener of this.listeners) {
            listener(readonlyState);
        }
    }

    /**
     * Subscribe to full state changes.
     */
    subscribe(fn: (state: ConfirmState<T, C>) => void): () => void {
        this.listeners.add(fn);
        return () => {
            this.listeners.delete(fn);
        };
    }

    /**
     * Open a new confirmation dialog.
     */
    open(options: any, context: any): void {
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
    close(): void {
        this.setState(createInitialState<T, C>() as any);
    }

    /**
     * Update the options of the currently open dialog.
     */
    updateOptions(options: any): void {
        const currentOptions = this.state.options;
        if (!this.state.isOpen || !currentOptions) return;
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
    updateContext(context: Partial<C>): void {
        if (!this.state.isOpen || !this.state.context) return;
        this.setState({
            context: {
                ...this.state.context,
                ...context,
            } as any,
        });
    }

    /**
     * Toggle the loading state (e.g., during async actions).
     */
    setLoading(loading: boolean): void {
        this.setState({ loading });
    }

    /**
     * Set a specific step index.
     */
    setStep(step: number): void {
        this.setState({ step });
    }

    /**
     * Reset the store to its initial state.
     */
    reset(): void {
        this.state = createInitialState<T, C>() as any;
        this.notify();
    }
}

/** Global singleton confirm store instance */
export const confirmStore = new ConfirmStore();
