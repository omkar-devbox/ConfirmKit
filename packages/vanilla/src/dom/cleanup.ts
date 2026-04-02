import { removeDefaultStyles } from '../styles';

/**
 * Performs cleanup of the DOM and styles when a dialog is unmounted.
 */
export function cleanupDom(overlay: HTMLElement | null) {
    if (overlay) {
        overlay.remove();
    }
    
    // Clean up default styles from the head
    removeDefaultStyles();
}
