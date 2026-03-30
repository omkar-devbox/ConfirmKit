"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConfirmEngine = void 0;
class ConfirmEngine {
    queue = [];
    current = null;
    listeners = new Set();
    /**
     * Main Promise-based API for handling confirmation flows sequentially.
     */
    confirm(options) {
        return new Promise((resolve, reject) => {
            const state = {
                id: Math.random().toString(36).substring(2, 10),
                isOpen: true,
                ...options,
                resolve: (value) => {
                    resolve(value);
                    this.closeCurrent();
                },
                reject: (reason) => {
                    reject(reason);
                    this.closeCurrent();
                }
            };
            this.queue.push(state);
            this.processQueue();
        });
    }
    processQueue() {
        if (this.current || this.queue.length === 0)
            return;
        this.current = this.queue.shift() || null;
        this.notify();
    }
    closeCurrent() {
        this.current = null;
        this.processQueue();
        this.notify();
    }
    // Observable-like subscription for the UI layer to react to changes
    subscribe(listener) {
        this.listeners.add(listener);
        listener(this.current);
        return () => this.listeners.delete(listener);
    }
    notify() {
        this.listeners.forEach((listener) => listener(this.current));
    }
}
exports.ConfirmEngine = ConfirmEngine;
