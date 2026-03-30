import { ConfirmOptions } from '../types/confirm.types';
import { ConfirmContext } from '../types/context.types';
/**
 * The main entry point for the confirmation dialog library.
 * Manages the high-level flow: Enqueuing -> Opening -> Executing -> Closing.
 * This class is framework-agnostic and acts as the brain of the engine.
 */
export declare class ConfirmService {
    /** The currently active dialog item from the queue */
    private activeItem;
    /** The context manager for the current active dialog */
    private contextManager;
    /**
     * Display a confirmation dialog.
     * Returns a promise that resolves with the result of the user action.
     */
    confirm<T = any, C extends ConfirmContext = ConfirmContext>(options: ConfirmOptions<T, C>): Promise<T | null>;
    /**
     * Internal method to process the next item in the queue.
     */
    private processQueue;
    /**
     * Handles a button click action.
     * This should be called by the UI renderer (React/Angular component).
     */
    handleAction(buttonId: string): Promise<void>;
    /**
     * Navigate to the next step.
     */
    next(): void;
    /**
     * Navigate to the previous step.
     */
    back(): void;
    /**
     * Navigate to a specific step by index or ID.
     */
    goTo(stepIdOrIndex: string | number): Promise<void>;
    /**
     * Close the current dialog with a result.
     * This resolves the promise returned by confirm().
     */
    close(result?: any): void;
    /**
     * Close all pending and active dialogs.
     */
    closeAll(): void;
    /**
     * Helper to create the action context for handler execution.
     */
    private createActionContext;
}
/** Global singleton confirm service instance */
export declare const confirmService: ConfirmService;
