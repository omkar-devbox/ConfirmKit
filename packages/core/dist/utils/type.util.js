"use strict";
// ================================
// Type Utilities
// ================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.isFunction = isFunction;
exports.resolveValue = resolveValue;
exports.resolveAsync = resolveAsync;
exports.isPromise = isPromise;
// Check if value is function
function isFunction(value) {
    return typeof value === 'function';
}
// Resolve value OR function
function resolveValue(value, context) {
    return isFunction(value)
        ? value(context)
        : value;
}
// Resolve async/sync function
async function resolveAsync(value, context) {
    if (isFunction(value)) {
        return await value(context);
    }
    return value;
}
// Check if value is Promise
function isPromise(value) {
    return (typeof value === 'object' &&
        value !== null &&
        'then' in value &&
        typeof value.then === 'function');
}
