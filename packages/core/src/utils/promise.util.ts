//================================
//  Promise Utilities
// ================================


// Deferred Promise (manual resolve/reject control)
export interface Deferred<T = unknown> {
  promise: Promise<T>;
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
}

// Create deferred promise
export function createDeferred<T = unknown>(): Deferred<T> {
  let resolve!: (value: T | PromiseLike<T>) => void;
  let reject!: (reason?: any) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return { promise, resolve, reject };
}


// Wrap sync/async function safely
export async function safePromise<T>(
  fn: () => T | Promise<T>
): Promise<[T | null, any]> {
  try {
    const result = await fn();
    return [result, null];
  } catch (error) {
    return [null, error];
  }
}
