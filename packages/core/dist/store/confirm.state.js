"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createInitialState = createInitialState;
/**
 * State factory for initialization and resetting.
 */
function createInitialState() {
    return {
        isOpen: false,
        options: null,
        context: null,
        loading: false,
        step: 0,
    };
}
