import { createPortalManager } from '@confirmkit/core/dom/portal';

/**
 * Creates a portal manager for the vanilla adapter.
 */
export function createPortal() {
    return createPortalManager({
        zIndex: 9999
    });
}
