"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyboardManager = void 0;
class KeyboardManager {
    onAction;
    handleKeyDown = (event) => {
        if (!this.onAction)
            return;
        // Abstracting raw DOM events into framework-agnostic actions
        if (event.key === 'Escape') {
            event.preventDefault();
            this.onAction('cancel');
        }
        else if (event.key === 'Enter') {
            event.preventDefault();
            this.onAction('confirm');
        }
    };
    attach(onAction) {
        this.onAction = onAction;
        // Binding at document level ensures we catch the event before other handlers swallow it
        document.addEventListener('keydown', this.handleKeyDown, { capture: true });
    }
    detach() {
        document.removeEventListener('keydown', this.handleKeyDown, { capture: true });
        this.onAction = undefined;
    }
}
exports.KeyboardManager = KeyboardManager;
