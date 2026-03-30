import { ConfirmContext } from './context.types';
import { KeyAction } from './common.types';
export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | string;
export interface ActionContext<T = any, C extends ConfirmContext = ConfirmContext> {
    /** The value associated with the button */
    value: T;
    /** Readonly access to the shared dialog context */
    context: Readonly<C>;
    /** Close the current dialog and resolve the promise with the given result */
    close: (result?: any) => void;
    /** Navigate to the next step (if multi-step) */
    next: () => void;
    /** Navigate to the previous step (if multi-step) */
    back: () => void;
    /** Navigate to a specific step by ID or index */
    goTo: (stepIdOrIndex: string | number) => void;
    /** Update the shared context dynamically */
    updateContext: (data: Partial<C> | ((prev: C) => Partial<C>)) => void;
    /** Manually set the loading state for the current dialog */
    setLoading: (loading: boolean) => void;
    /** Emit a custom event through the core event bus */
    emit: (event: string, payload?: any) => void;
}
export interface ConfirmButton<T = any, C extends ConfirmContext = ConfirmContext> {
    /** Unique identifier for the button */
    id: string;
    /** Display label. Supports dynamic strings based on context. */
    label: string | ((ctx: ActionContext<T, C>) => string);
    /** The result value returned when this button is clicked */
    value?: T;
    /** Optional custom renderer for framework-agnostic implementations */
    render?: (ctx: ActionContext<T, C>) => any;
    /** visual variant */
    variant?: ButtonVariant;
    /** Custom CSS classes */
    className?: string;
    /** Disable state. Supports dynamic evaluation. */
    disabled?: boolean | ((ctx: ActionContext<T, C>) => boolean);
    /** Hidden state. Supports dynamic evaluation. */
    hidden?: boolean | ((ctx: ActionContext<T, C>) => boolean);
    /** Show a loading spinner/state on this specific button */
    loading?: boolean;
    /** Keyboard shortcut(s) for this button (e.g., 'Enter', ['Ctrl', 'S']) */
    key?: string | string[];
    /** Map a physical key to a logical action override */
    keyAction?: KeyAction;
    /** Main action handler. Can be async. */
    action?: (ctx: ActionContext<T, C>) => void | Promise<void>;
    /** Hook called before the main action. Cancellation supported if returns false. */
    beforeAction?: (ctx: ActionContext<T, C>) => boolean | Promise<boolean>;
    /** Hook called after the main action finishes successfully. */
    afterAction?: (ctx: ActionContext<T, C>) => void;
    /** Whether to automatically close the dialog after the action finishes (default: true) */
    autoClose?: boolean;
    /** Semantic role for accessibility and default behaviors */
    role?: 'confirm' | 'cancel' | 'close' | string;
    /** Display order / priority */
    order?: number;
    /** Extensibility metadata */
    meta?: Record<string, any>;
}
