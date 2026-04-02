/**
 * DOM Utilities for React Adapter
 */

export const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

export function getActiveElement(): Element | null {
    if (!isBrowser) return null;
    return document.activeElement;
}
