import { RendererAdapter } from '@confirmkit/core';
import { 
    injectDefaultStyles, 
    applyStyles,
    defaultCSS,
    defaultStyles,
} from '../styles';
import { resolvePreset } from '../styles/variants';
import { resolveIcon } from './icons';
import { ConfirmStyles, VanillaRendererOptions } from '../types';
import { cleanupDom } from './cleanup';

/**
 * Creates the vanilla renderer adapter.
 * Implementation refactored for clarity and modularity.
 */
export function createVanillaRenderer(options: VanillaRendererOptions): RendererAdapter {
    const { getState, confirmAction, cancelAction } = options;
    let overlay: HTMLElement | null = null;
    let confirmBtn: HTMLButtonElement | null = null;

    return {
        mount: (parent: HTMLElement) => {
            const state = getState();
            if (!state) return;

            const confirmOptions = state.options;
            const styles = confirmOptions.styles as ConfirmStyles;
            const hasCustomStyles = !!styles;

            // Resolve variant/presets
            const variant = confirmOptions.variant;
            const preset = resolvePreset(variant as string, state.presets);

            // If no custom styles provided, inject default ones
            if (!hasCustomStyles) {
                injectDefaultStyles(defaultCSS);
            }

            // 1. Overlay
            overlay = document.createElement('div');
            overlay.className = 'ck-overlay';
            applyStyles(overlay, defaultStyles.overlay, preset?.overlay, styles?.overlay);
            
            overlay.onclick = (e) => {
                if (e.target === overlay && confirmOptions.closeOnEsc !== false) {
                    cancelAction();
                }
            };

            // 2. Container
            const container = document.createElement('div');
            container.setAttribute('role', 'dialog');
            container.setAttribute('aria-modal', 'true');
            container.className = 'ck-container';
            applyStyles(container, defaultStyles.container, preset?.container, styles?.container);
            overlay.appendChild(container);

            // 2b. Icon (NEW)
            const iconEl = resolveIcon(confirmOptions.icon);
            if (iconEl) {
                applyStyles(iconEl, preset?.icon, styles?.icon);
                container.appendChild(iconEl);
            }

            // 3. Title
            const titleEl = document.createElement('h2');
            titleEl.className = 'ck-title';
            titleEl.textContent = typeof confirmOptions.title === 'function' 
                ? confirmOptions.title(state.context) 
                : (confirmOptions.title || '');
            applyStyles(titleEl, defaultStyles.title, preset?.title, styles?.title);
            container.appendChild(titleEl);

            // 4. Description
            const descriptionEl = document.createElement('p');
            descriptionEl.className = 'ck-description';
            descriptionEl.textContent = typeof confirmOptions.message === 'function' 
                ? confirmOptions.message(state.context) 
                : (confirmOptions.message || '');
            applyStyles(descriptionEl, defaultStyles.description, preset?.description, styles?.description);
            container.appendChild(descriptionEl);

            // 5. Actions Container
            const actionsEl = document.createElement('div');
            actionsEl.className = 'ck-actions';
            applyStyles(actionsEl, defaultStyles.actions, preset?.actions, styles?.actions);
            container.appendChild(actionsEl);

            // 6. Cancel Button
            const cancelBtn = document.createElement('button');
            cancelBtn.type = 'button';
            cancelBtn.className = 'ck-btn ck-btn-cancel';
            cancelBtn.textContent = confirmOptions.cancelText || 'Cancel';
            cancelBtn.onclick = cancelAction;
            applyStyles(cancelBtn, defaultStyles.cancelButton, preset?.cancelButton, styles?.cancelButton);
            actionsEl.appendChild(cancelBtn);

            // 7. Confirm Button
            confirmBtn = document.createElement('button');
            confirmBtn.type = 'button';
            confirmBtn.className = 'ck-btn ck-btn-confirm';
            confirmBtn.textContent = confirmOptions.confirmText || 'OK';
            confirmBtn.onclick = confirmAction;
            applyStyles(confirmBtn, defaultStyles.confirmButton, preset?.confirmButton, styles?.confirmButton);
            actionsEl.appendChild(confirmBtn);

            parent.appendChild(overlay);
        },

        update: () => {
            const state = getState();
            if (!state || !confirmBtn) return;

            confirmBtn.disabled = state.loading;
            if (state.loading) {
                confirmBtn.textContent = '...';
            } else {
                confirmBtn.textContent = state.options.confirmText || 'OK';
            }
        },

        unmount: () => {
            cleanupDom(overlay);
            overlay = null;
            confirmBtn = null;
        }
    };
}
