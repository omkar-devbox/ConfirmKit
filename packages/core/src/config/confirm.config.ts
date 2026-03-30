import { ConfirmBehavior, ConfirmUIConfig } from '../types/confirm.types';
import { KeyboardMap } from '../types/common.types';

/**
 * Global configuration for all confirmation dialogs.
 */
export interface ConfirmGlobalConfig {
    behavior?: ConfirmBehavior;
    ui?: ConfirmUIConfig;
    keyboard?: KeyboardMap;
}

/**
 * Default library configuration.
 * Provides sensible defaults for behavior, UI, and keyboard shortcuts.
 */
const DEFAULT_CONFIG: Required<ConfirmGlobalConfig> = {
    behavior: {
        closeOnBackdrop: true,
        closeOnEsc: true,
        persistent: false,
        keyboard: {},
        trapFocus: true,
        initialFocus: 'confirm',
        restoreFocus: true,
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
export class ConfirmConfig {
    private config: ConfirmGlobalConfig = { ...DEFAULT_CONFIG };

    /**
     * Get the current global configuration.
     */
    get(): ConfirmGlobalConfig {
        return this.config;
    }

    /**
     * Update the global configuration with partial overrides.
     * Performs a deep merge for behavior, ui, and keyboard.
     */
    set(config: Partial<ConfirmGlobalConfig>): void {
        this.config = this.merge(config);
    }

    /**
     * Merge the global config with specific local options.
     * Useful for creating a final set of options for a single dialog instance.
     */
    merge(local: Partial<ConfirmGlobalConfig>): ConfirmGlobalConfig {
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
        } as ConfirmGlobalConfig;
    }

    /**
     * Reset the global configuration to library defaults.
     */
    reset(): void {
        this.config = { ...DEFAULT_CONFIG };
    }
}

/** Global singleton configuration manager instance */
export const confirmConfig = new ConfirmConfig();
