export declare function isFunction<T>(value: unknown): value is (...args: unknown[]) => T;
export declare function resolveValue<T, C>(value: T | ((ctx: C) => T), context: C): T;
export declare function resolveAsync<T, C>(value: T | ((ctx: C) => T | Promise<T>), context: C): Promise<T>;
export declare function isPromise<T = unknown>(value: unknown): value is Promise<T>;
