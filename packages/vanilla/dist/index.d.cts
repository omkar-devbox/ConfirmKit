import * as _confirmkit_core_engine_confirm_state from '@confirmkit/core/engine/confirm.state';
import * as _confirmkit_core from '@confirmkit/core';
import { ConfirmContext, ConfirmOptions, RendererAdapter, BuiltInVariant as BuiltInVariant$1, IconType } from '@confirmkit/core';

interface VanillaConfirmOptions<C extends ConfirmContext = ConfirmContext, R = boolean, TVariant extends string = never> extends Omit<ConfirmOptions<C, R, TVariant>, 'title' | 'message' | 'styles'> {
    title?: string | ((ctx: C) => string);
    message?: string | ((ctx: C) => string);
    description?: string | ((ctx: C) => string);
    styles?: ConfirmStyles;
}

interface VanillaRendererOptions {
    getState: () => _confirmkit_core.ConfirmState<any, any> | null;
    confirmAction: () => void;
    cancelAction: () => void;
}

interface ConfirmStyles {
    overlay?: Partial<CSSStyleDeclaration>;
    container?: Partial<CSSStyleDeclaration>;
    title?: Partial<CSSStyleDeclaration>;
    description?: Partial<CSSStyleDeclaration>;
    actions?: Partial<CSSStyleDeclaration>;
    confirmButton?: Partial<CSSStyleDeclaration>;
    cancelButton?: Partial<CSSStyleDeclaration>;
    icon?: Partial<CSSStyleDeclaration>;
}

/**
 * Production-grade Vanilla JS confirm() API.
 * Connects the core controller to the Vanilla renderer.
 */
declare function confirm(options: VanillaConfirmOptions | string): Promise<boolean>;
/**
 * Factory to create a new ConfirmKit instance pre-configured with the Vanilla renderer.
 */
declare function createConfirmKit<C extends Record<string, unknown> = Record<string, unknown>, R = boolean, TVariant extends string = never>(config?: {
    presets?: Record<TVariant, any>;
}): {
    confirm: (options: VanillaConfirmOptions<C, R, TVariant> | string) => Promise<R>;
    setRenderer: (adapter: _confirmkit_core.RendererAdapter) => void;
    confirmAction: () => Promise<void>;
    cancelAction: () => void;
    subscribe: (listener: _confirmkit_core_engine_confirm_state.StateListener<C, R, TVariant>) => () => boolean;
    getState: () => _confirmkit_core_engine_confirm_state.InternalState<C, R, TVariant> | null;
    patchContext: (updater: (prev: C) => Partial<C>) => void;
    setLoading: (loading: boolean) => void;
    destroy: () => void;
};
/**
 * Alias for createConfirmKit to match common naming conventions.
 */
declare const createConfirm: typeof createConfirmKit;

declare const controller: {
    open: (options: _confirmkit_core.ConfirmOptions<ConfirmContext, boolean, never>) => Promise<boolean>;
    confirmAction: () => Promise<void>;
    cancelAction: () => void;
    close: (result: boolean) => void;
    setLoading: (loading: boolean) => void;
    patchContext: (updater: (prev: ConfirmContext) => Partial<ConfirmContext>) => void;
    destroy: () => void;
};

/**
 * Internal state/context for the vanilla adapter.
 * Currently serves as a placeholder for adapter-specific metadata.
 */
declare const internalContext: {
    adapterName: string;
};

/**
 * Creates the vanilla renderer adapter.
 * Implementation refactored for clarity and modularity.
 */
declare function createVanillaRenderer(options: VanillaRendererOptions): RendererAdapter;

/**
 * Creates a portal manager for the vanilla adapter.
 */
declare function createPortal(): {
    getPortal: () => HTMLElement | null;
    removePortal: () => void;
};

/**
 * Performs cleanup of the DOM and styles when a dialog is unmounted.
 */
declare function cleanupDom(overlay: HTMLElement | null): void;

/**
 * Creates a built-in icon element.
 */
declare function createBuiltInIcon(type: BuiltInVariant$1): HTMLElement;
/**
 * Resolves an icon based on its type.
 */
declare function resolveIcon(icon?: IconType): HTMLElement | null;

/**
 * Applies custom CSS properties to an element, optionally merging with a base style.
 */
declare function applyStyles(element: HTMLElement | null, base?: Partial<CSSStyleDeclaration>, ...overrides: (Partial<CSSStyleDeclaration> | undefined | null)[]): void;
/**
 * Injects default CSS into the document head
 */
declare function injectDefaultStyles(css: string): void;
/**
 * Removes default CSS from the document head
 */
declare function removeDefaultStyles(): void;

declare const defaultStyles: Required<ConfirmStyles>;
declare const defaultCSS = "\n.ck-overlay {\n    animation: ck-fade-in 0.2s ease-out;\n}\n\n.ck-container {\n    animation: ck-scale-up 0.25s ease;\n}\n\n.ck-btn {\n    width: 100%;\n    padding: 12px 16px;\n    border-radius: 12px;\n    font-weight: 600;\n    font-size: 0.95rem;\n    border: none;\n    cursor: pointer;\n    transition: all 0.2s ease;\n}\n\n.ck-btn-confirm:hover {\n    transform: translateY(-1px);\n    box-shadow: 0 8px 20px rgba(37, 99, 235, 0.45);\n}\n\n.ck-btn-cancel:hover {\n    background: #dbeafe;\n}\n\n.ck-icon, .ck-icon-custom {\n    display: flex;\n    justify-content: center;\n    align-items: center;\n    margin: 0 auto 16px;\n    animation: ck-scale-up 0.3s ease-out;\n}\n\n@keyframes ck-fade-in {\n    from { opacity: 0; }\n    to { opacity: 1; }\n}\n\n@keyframes ck-scale-up {\n    from { transform: scale(0.9); opacity: 0; }\n    to { transform: scale(1); opacity: 1; }\n}\n";

/**
 * Safely merges two style objects.
 *
 * - Only overrides provided properties.
 * - Keeps remaining default styles intact.
 * - Ignores undefined values from overrides.
 * - Returns a new object (no mutation of base).
 */
declare function mergeStyles(base: Partial<CSSStyleDeclaration>, ...overrides: (Partial<CSSStyleDeclaration> | undefined | null)[]): Partial<CSSStyleDeclaration>;

type BuiltInVariant = 'success' | 'error' | 'warning' | 'info';
declare const BUILT_IN_PRESETS: Record<BuiltInVariant, Partial<ConfirmStyles>>;
/**
 * Resolves a preset based on the variant name.
 */
declare function resolvePreset(variant: string | undefined, custom?: Record<string, Partial<ConfirmStyles>>): Partial<ConfirmStyles> | undefined;

export { BUILT_IN_PRESETS, type BuiltInVariant, type ConfirmStyles, type VanillaConfirmOptions, type VanillaRendererOptions, applyStyles, cleanupDom, confirm, controller, createBuiltInIcon, createConfirm, createConfirmKit, createPortal, createVanillaRenderer, defaultCSS, defaultStyles, injectDefaultStyles, internalContext, mergeStyles, removeDefaultStyles, resolveIcon, resolvePreset };
