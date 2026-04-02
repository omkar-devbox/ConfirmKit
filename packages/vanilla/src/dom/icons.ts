import { BuiltInVariant, IconType } from '@confirmkit/core';

const ICONS: Record<BuiltInVariant, string> = {
    success: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
    error: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
    warning: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`,
    info: `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`
};

/**
 * Creates a built-in icon element.
 */
export function createBuiltInIcon(type: BuiltInVariant): HTMLElement {
    const wrapper = document.createElement('div');
    wrapper.className = 'ck-icon';
    wrapper.innerHTML = ICONS[type];
    return wrapper;
}

/**
 * Resolves an icon based on its type.
 */
export function resolveIcon(icon?: IconType): HTMLElement | null {
    if (!icon) return null;

    if (icon instanceof HTMLElement) return icon;

    if (typeof icon === 'string') {
        // Check if it's a built-in variant first
        if (Object.keys(ICONS).includes(icon)) {
            return createBuiltInIcon(icon as BuiltInVariant);
        }
        
        // Treat as innerHTML
        const el = document.createElement('div');
        el.className = 'ck-icon-custom';
        el.innerHTML = icon;
        return el;
    }

    return null;
}
