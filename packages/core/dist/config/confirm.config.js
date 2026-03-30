"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmConfig = exports.ConfirmConfig = void 0;
/**
 * Default library configuration.
 * Provides sensible defaults for behavior, UI, and keyboard shortcuts.
 */
const DEFAULT_CONFIG = {
    behavior: {
        closeOnBackdrop: true,
        closeOnEsc: true,
        persistent: false,
        keyboard: {},
        trapFocus: true,
        autoFocus: true,
        autoClose: 0,
    },
    ui: {
        className: '',
        overlayClass: '',
        position: 'center',
        device: 'auto',
        mobile: {
            fullscreen: true,
            bottomSheet: false,
        },
        desktop: {
            width: 400,
            draggable: false,
        },
        animation: {
            enter: 'fade-in',
            exit: 'fade-out',
            duration: 200,
        },
        theme: 'light',
    },
    keyboard: {
        Enter: 'confirm',
        Escape: 'cancel',
        ArrowRight: 'next',
        ArrowLeft: 'back',
        PageDown: 'next',
        PageUp: 'back',
    },
};
/**
 * Manages global and local configuration merging.
 * Ensures defaults are always applied and nested objects are merged deeply.
 */
class ConfirmConfig {
    config = { ...DEFAULT_CONFIG };
    /**
     * Get the current global configuration.
     */
    get() {
        return this.config;
    }
    /**
     * Update the global configuration with partial overrides.
     * Performs a deep merge for behavior, ui, and keyboard.
     */
    set(config) {
        this.config = this.merge(config);
    }
    /**
     * Merge the global config with specific local options.
     * Useful for creating a final set of options for a single dialog instance.
     */
    merge(local) {
        return {
            ...this.config,
            ...local,
            behavior: {
                ...this.config.behavior,
                ...local.behavior,
            },
            ui: {
                ...this.config.ui,
                ...local.ui,
            },
            keyboard: {
                ...this.config.keyboard,
                ...local.keyboard,
            },
        };
    }
    /**
     * Reset the global configuration to library defaults.
     */
    reset() {
        this.config = { ...DEFAULT_CONFIG };
    }
}
exports.ConfirmConfig = ConfirmConfig;
/** Global singleton configuration manager instance */
exports.confirmConfig = new ConfirmConfig();
