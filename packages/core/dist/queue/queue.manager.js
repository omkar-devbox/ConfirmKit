"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.queueManager = exports.QueueManager = void 0;
const event_bus_1 = require("../events/event.bus");
/**
 * Manages a FIFO queue of confirmation dialogs to prevent race conditions.
 * Ensures only one dialog is active at a time if managed properly by the service.
 */
class QueueManager {
    queue = [];
    /**
     * Add an item to the end of the queue.
     */
    enqueue(item) {
        this.queue.push(item);
        this.notify();
    }
    /**
     * Remove and return the first item from the queue.
     */
    dequeue() {
        const item = this.queue.shift();
        if (item)
            this.notify();
        return item;
    }
    /**
     * Peek at the first item without removing it.
     */
    peek() {
        return this.queue[0];
    }
    /**
     * Clear all pending items.
     */
    clear() {
        this.queue = [];
        this.notify();
    }
    /**
     * Get the current number of pending items.
     */
    size() {
        return this.queue.length;
    }
    /**
     * Check if the queue is empty.
     */
    isEmpty() {
        return this.queue.length === 0;
    }
    /**
     * Notify about queue changes.
     */
    notify() {
        event_bus_1.eventBus.emit('queue:update', { size: this.size() });
    }
}
exports.QueueManager = QueueManager;
/** Global singleton queue manager instance */
exports.queueManager = new QueueManager();
