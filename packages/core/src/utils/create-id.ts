//================================
//  ID Generator
// ================================


// Generates unique ID Uses crypto if available, fallback to timestamp + random

export function createId(prefix = 'id'): string {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
        return `${prefix}-${crypto.randomUUID()}`;
    }

    const random = Math.random().toString(36).slice(2);
    const time = Date.now().toString(36);

    return `${prefix}-${time}-${random}`;
}
