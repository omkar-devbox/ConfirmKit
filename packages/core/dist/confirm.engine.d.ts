import { ConfirmOptions, ConfirmState } from './types';
export declare class ConfirmEngine {
    private queue;
    private current;
    private listeners;
    /**
     * Main Promise-based API for handling confirmation flows sequentially.
     */
    confirm<TData = any, TContext = any>(options: ConfirmOptions<TData, TContext>): Promise<boolean>;
    private processQueue;
    private closeCurrent;
    subscribe(listener: (state: ConfirmState | null) => void): () => void;
    private notify;
}
