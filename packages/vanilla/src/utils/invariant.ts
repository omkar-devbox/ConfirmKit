/**
 * Simple invariant check that throws an error if the condition is false.
 */
export function invariant(condition: unknown, message?: string): asserts condition {
    if (!condition) {
        throw new Error(message || 'Invariant violation');
    }
}
