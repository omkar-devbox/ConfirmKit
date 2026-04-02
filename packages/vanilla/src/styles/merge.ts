/**
 * Safely merges two style objects.
 * 
 * - Only overrides provided properties.
 * - Keeps remaining default styles intact.
 * - Ignores undefined values from overrides.
 * - Returns a new object (no mutation of base).
 */
export function mergeStyles(
    base: Partial<CSSStyleDeclaration>,
    ...overrides: (Partial<CSSStyleDeclaration> | undefined | null)[]
): Partial<CSSStyleDeclaration> {
    const result = { ...base };

    for (const override of overrides) {
        if (!override) continue;

        for (const key in override) {
            if (Object.prototype.hasOwnProperty.call(override, key)) {
                const k = key as keyof CSSStyleDeclaration;
                const value = override[k];
                if (value !== undefined && value !== null) {
                    // @ts-ignore - dynamic style assignment is safe here after key casting
                    result[k] = value as any;
                }
            }
        }
    }

    return result;
}
