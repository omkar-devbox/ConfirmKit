// ================================
// Type Utilities
// ================================


// Check if value is function
export function isFunction<T>(
    value: unknown
): value is (...args: unknown[]) => T {
    return typeof value === 'function';
}

// Resolve value OR function
export function resolveValue<T, C>(
    value: T | ((ctx: C) => T),
    context: C
): T {
    return isFunction<(ctx: C) => T>(value)
        ? (value as (ctx: C) => T)(context)
        : (value as T);
}

// Resolve async/sync function
export async function resolveAsync<T, C>(
    value: T | ((ctx: C) => T | Promise<T>),
    context: C
): Promise<T> {
    if (isFunction<(ctx: C) => T | Promise<T>>(value)) {
        return await (value as (ctx: C) => T | Promise<T>)(context);
    }
    return value as T;
}


// Check if value is Promise
export function isPromise<T = unknown>(
    value: unknown
): value is Promise<T> {
    return (
        typeof value === 'object' &&
        value !== null &&
        'then' in value &&
        typeof (value as { then: unknown }).then === 'function'
    );
}
