import { ConfirmStyles } from '../types';

export type BuiltInVariant = 'success' | 'error' | 'warning' | 'info';

export const BUILT_IN_PRESETS: Record<BuiltInVariant, Partial<ConfirmStyles>> = {
    success: {
        confirmButton: {
            background: 'linear-gradient(135deg, #10b981, #059669)',
            boxShadow: '0 6px 14px rgba(16, 185, 129, 0.35)',
        },
        icon: { color: '#10b981' }
    },
    error: {
        confirmButton: {
            background: 'linear-gradient(135deg, #ef4444, #dc2626)',
            boxShadow: '0 6px 14px rgba(239, 68, 68, 0.35)',
        },
        icon: { color: '#ef4444' }
    },
    warning: {
        confirmButton: {
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            boxShadow: '0 6px 14px rgba(245, 158, 11, 0.35)',
        },
        icon: { color: '#f59e0b' }
    },
    info: {
        confirmButton: {
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            boxShadow: '0 6px 14px rgba(59, 130, 246, 0.35)',
        },
        icon: { color: '#3b82f6' }
    }
};

/**
 * Resolves a preset based on the variant name.
 */
export function resolvePreset(
    variant: string | undefined,
    custom?: Record<string, Partial<ConfirmStyles>>
): Partial<ConfirmStyles> | undefined {
    if (!variant) return undefined;
    return custom?.[variant] || BUILT_IN_PRESETS[variant as BuiltInVariant];
}
