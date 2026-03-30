import { ConfirmButton } from './button.types';
import { ConfirmContext } from './context.types';
import { DeviceType, KeyboardMap, AsyncOrSync } from './common.types';
export interface ConfirmOptions<T = any, C extends ConfirmContext = ConfirmContext> {
    /** Unique identifier for this dialog instance. */
    id?: string;
    /** Dialog title. Supports dynamic strings based on shared context. */
    title?: string | ((ctx: Readonly<C>) => string);
    /** Dialog main message/body. Supports dynamic content. */
    message?: string | ((ctx: Readonly<C>) => string);
    /** Fully custom content renderer for complex UIs. */
    content?: ConfirmContent<T, C>;
    /** Array of buttons to display. */
    buttons?: ConfirmButton<T, C>[];
    /** Initial data for the shared context. */
    context?: C;
    /** Behavior settings (esc, backdrop, focus, etc.) */
    behavior?: ConfirmBehavior;
    /** UI-specific configuration for mobile and desktop. */
    ui?: ConfirmUIConfig;
    /** Global lifecycle hooks for the entire dialog. */
    hooks?: ConfirmHooks<T, C>;
    /** Multi-step flow configuration. */
    steps?: ConfirmStep<T, C>[];
    /** Overrides for specific devices. */
    responsive?: ConfirmResponsive<T, C>;
    /** Extensibility metadata. */
    meta?: Record<string, any>;
}
export type ConfirmContent<T = any, C extends ConfirmContext = ConfirmContext> = string | ((context: Readonly<C>) => any);
export interface ConfirmBehavior {
    /** Close when the backdrop/overlay is clicked. */
    closeOnBackdrop?: boolean;
    /** Close when the Escape key is pressed. */
    closeOnEsc?: boolean;
    /** Prevent closing until an action is explicitly taken. */
    persistent?: boolean;
    /** Custom keyboard mapping for this specific dialog. */
    keyboard?: KeyboardMap;
    /** Contain focus within the dialog (Accessibility). */
    trapFocus?: boolean;
    /** Automatically focus the primary button on open. */
    autoFocus?: boolean;
    /** Automatically close after a duration (ms). 0 to disable. */
    autoClose?: number;
}
export interface ConfirmUIConfig {
    /** Root container class name. */
    className?: string;
    /** Overlay/Backdrop container class name. */
    overlayClass?: string;
    /** Horizontal/Vertical alignment. */
    position?: 'center' | 'top' | 'bottom' | 'fullscreen' | string;
    /** Forced device mode. */
    device?: DeviceType;
    /** Mobile-specific overrides. */
    mobile?: {
        fullscreen?: boolean;
        bottomSheet?: boolean;
    };
    /** Desktop-specific overrides. */
    desktop?: {
        width?: number | string;
        draggable?: boolean;
    };
    /** Animation configuration. */
    animation?: {
        enter?: string;
        exit?: string;
        duration?: number;
    };
    /** visual theme. */
    theme?: 'light' | 'dark' | string;
}
export interface ConfirmHooks<T = any, C extends ConfirmContext = ConfirmContext> {
    /** Called immediately after the dialog opens. */
    onOpen?: (ctx: Readonly<C>) => void;
    /** Called immediately after the dialog closes. */
    onClose?: (result: T | null, ctx: Readonly<C>) => void;
    /** Called when a 'confirm' role action succeeds. */
    onConfirm?: (value: T, ctx: Readonly<C>) => void;
    /** Called when a 'cancel' role action succeeds. */
    onCancel?: (ctx: Readonly<C>) => void;
    /** Called when any action handler throws an error. */
    onError?: (error: any, ctx: Readonly<C>) => void;
    /** Called before navigating to a new step. Returning false cancels navigation. */
    beforeStepChange?: (from: number, to: number, ctx: Readonly<C>) => AsyncOrSync<boolean>;
}
export interface ConfirmStep<T = any, C extends ConfirmContext = ConfirmContext> {
    /** Unique ID for navigation reference. */
    id?: string;
    /** step-specific title. */
    title?: string | ((ctx: Readonly<C>) => string);
    /** step-specific message. */
    message?: string | ((ctx: Readonly<C>) => string);
    /** step-specific custom content. */
    content?: ConfirmContent<T, C>;
    /** step-specific buttons. */
    buttons?: ConfirmButton<T, C>[];
    /** step-specific metadata. */
    meta?: Record<string, any>;
}
export interface ConfirmResponsive<T = any, C extends ConfirmContext = ConfirmContext> {
    mobile?: Partial<ConfirmOptions<T, C>>;
    desktop?: Partial<ConfirmOptions<T, C>>;
}
export interface ConfirmState<T = any, C extends ConfirmContext = ConfirmContext> {
    /** Is a dialog currently visible. */
    isOpen: boolean;
    /** Active options (merged). */
    options: ConfirmOptions<T, C> | null;
    /** Current context values. */
    context: C | null;
    /** Global processing state. */
    loading: boolean;
    /** Current step index (zero-based). */
    step: number;
}
