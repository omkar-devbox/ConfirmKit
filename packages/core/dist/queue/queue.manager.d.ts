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
export declare class QueueManager<T = any> {
    private queue;
    /**
     * Add an item to the end of the queue.
     */
    enqueue(item: QueueItem<T>): void;
    /**
     * Remove and return the first item from the queue.
     */
    dequeue(): QueueItem<T> | undefined;
    /**
     * Peek at the first item without removing it.
     */
    peek(): QueueItem<T> | undefined;
    /**
     * Clear all pending items.
     */
    clear(): void;
    /**
     * Get the current number of pending items.
     */
    size(): number;
    /**
     * Check if the queue is empty.
     */
    isEmpty(): boolean;
    /**
     * Notify about queue changes.
     */
    private notify;
}
/** Global singleton queue manager instance */
export declare const queueManager: QueueManager<any>;
