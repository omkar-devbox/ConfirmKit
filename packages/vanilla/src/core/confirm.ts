import { createConfirmKit as createCoreKit, ConfirmInput } from '@confirmkit/core';
import { controller } from './controller';
import { VanillaConfirmOptions } from '../types';
import { createVanillaRenderer } from '../dom/renderer';

/**
 * Production-grade Vanilla JS confirm() API.
 * Connects the core controller to the Vanilla renderer.
 */
export async function confirm(options: VanillaConfirmOptions | string): Promise<boolean> {
    // 1. Normalize input to core's ConfirmOptions shape
    const input = typeof options === 'string'
        ? { message: options, title: 'Confirm' }
        : {
            ...options,
            message: options.message || options.description || ''
        };

    // 2. Open via the core controller (queue handles sequentiality)
    return controller.open({
        confirmText: 'OK',
        cancelText: 'Cancel',
        closeOnEsc: true,
        ...input
    });
}

/**
 * Factory to create a new ConfirmKit instance pre-configured with the Vanilla renderer.
 */
export function createConfirmKit<
    C extends Record<string, unknown> = Record<string, unknown>,
    R = boolean,
    TVariant extends string = never
>(config?: { presets?: Record<TVariant, any> }) {
    const kit = createCoreKit<C, R, TVariant>(config);

    kit.setRenderer(createVanillaRenderer({
        getState: kit.getState as any,
        confirmAction: kit.confirmAction,
        cancelAction: kit.cancelAction
    }));

    // Wrap confirm to support VanillaConfirmOptions (description alias)
    const originalConfirm = kit.confirm;
    const vanillaConfirm = (options: VanillaConfirmOptions<C, R, TVariant> | string): Promise<R> => {
        const input = typeof options === 'string'
            ? options
            : {
                ...options,
                message: options.message || options.description || ''
            };
        return originalConfirm(input as any);
    };

    return {
        ...kit,
        confirm: vanillaConfirm
    };
}

/**
 * Alias for createConfirmKit to match common naming conventions.
 */
export const createConfirm = createConfirmKit;
