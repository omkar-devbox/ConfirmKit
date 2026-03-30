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
 * Manages global and local configuration merging.
 * Ensures defaults are always applied and nested objects are merged deeply.
 */
export declare class ConfirmConfig {
    private config;
    /**
     * Get the current global configuration.
     */
    get(): ConfirmGlobalConfig;
    /**
     * Update the global configuration with partial overrides.
     * Performs a deep merge for behavior, ui, and keyboard.
     */
    set(config: Partial<ConfirmGlobalConfig>): void;
    /**
     * Merge the global config with specific local options.
     * Useful for creating a final set of options for a single dialog instance.
     */
    merge(local: Partial<ConfirmGlobalConfig>): ConfirmGlobalConfig;
    /**
     * Reset the global configuration to library defaults.
     */
    reset(): void;
}
/** Global singleton configuration manager instance */
export declare const confirmConfig: ConfirmConfig;
