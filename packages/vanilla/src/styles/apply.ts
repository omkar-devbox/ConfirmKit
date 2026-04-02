import { mergeStyles } from './merge';

/**
 * Applies custom CSS properties to an element, optionally merging with a base style.
 */
export function applyStyles(
    element: HTMLElement | null,
    base?: Partial<CSSStyleDeclaration>,
    ...overrides: (Partial<CSSStyleDeclaration> | undefined | null)[]
): void {
    if (!element) return;
    
    // Merge base defaults with multiple overrides
    const finalStyles = mergeStyles(base || {}, ...overrides);
    
    if (Object.keys(finalStyles).length > 0) {
        Object.assign(element.style, finalStyles);
    }
}

const STYLE_ID = 'confirmkit-vanilla-styles';

/**
 * Injects default CSS into the document head
 */
export function injectDefaultStyles(css: string) {
    if (typeof document === 'undefined' || document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = css;
    document.head.appendChild(style);
}

/**
 * Removes default CSS from the document head
 */
export function removeDefaultStyles() {
    if (typeof document === 'undefined') return;
    const style = document.getElementById(STYLE_ID);
    if (style) style.remove();
}
