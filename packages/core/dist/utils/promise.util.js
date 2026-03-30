"use strict";
//================================
//  Promise Utilities
// ================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDeferred = createDeferred;
exports.safePromise = safePromise;
// Create deferred promise
function createDeferred() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return { promise, resolve, reject };
}
// Wrap sync/async function safely
async function safePromise(fn) {
    try {
        const result = await fn();
        return [result, null];
    }
    catch (error) {
        return [null, error];
    }
}
