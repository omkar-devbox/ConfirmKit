export interface Deferred<T = unknown> {
    promise: Promise<T>;
    resolve: (value: T | PromiseLike<T>) => void;
    reject: (reason?: any) => void;
}
export declare function createDeferred<T = unknown>(): Deferred<T>;
export declare function safePromise<T>(fn: () => T | Promise<T>): Promise<[T | null, any]>;
