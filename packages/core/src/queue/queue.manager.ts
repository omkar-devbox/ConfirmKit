import { eventBus } from '../events/event.bus';

/**
 * Internal item for the queue manager.
 */
export interface QueueItem<T = any> {
    id: string;
    payload: T;
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
}

/**
 * Manages a FIFO queue of confirmation dialogs to prevent race conditions.
 * Ensures only one dialog is active at a time if managed properly by the service.
 */
export class QueueManager<T = any> {
    private queue: QueueItem<T>[] = [];

    /**
     * Add an item to the end of the queue.
     */
    enqueue(item: QueueItem<T>): void {
        this.queue.push(item);
        this.notify();
    }

    /**
     * Remove and return the first item from the queue.
     */
    dequeue(): QueueItem<T> | undefined {
        const item = this.queue.shift();
        if (item) this.notify();
        return item;
    }

    /**
     * Peek at the first item without removing it.
     */
    peek(): QueueItem<T> | undefined {
        return this.queue[0];
    }

    /**
     * Clear all pending items.
     */
    clear(): void {
        this.queue = [];
        this.notify();
    }

    /**
     * Get the current number of pending items.
     */
    size(): number {
        return this.queue.length;
    }

    /**
     * Check if the queue is empty.
     */
    isEmpty(): boolean {
        return this.queue.length === 0;
    }

    /**
     * Notify about queue changes.
     */
    private notify(): void {
        eventBus.emit('queue:update', { size: this.size() });
    }
}

/** Global singleton queue manager instance */
export const queueManager = new QueueManager();
