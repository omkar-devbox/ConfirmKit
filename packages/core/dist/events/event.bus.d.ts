import { ConfirmEventType, EventHandler, EventPayload } from '../types/common.types';
/**
 * Type-safe Event Bus for core library communication.
 * Prevents memory leaks by ensuring proper listener cleanup.
 */
export declare class EventBus {
    private listeners;
    /**
     * Subscribe to a specific event type.
     * Returns an unsubscribe function.
     */
    on<K extends ConfirmEventType>(type: K, handler: EventHandler<K>): () => void;
    /**
     * Emit an event with proper payload and timestamp.
     */
    emit<K extends ConfirmEventType>(type: K, data: EventPayload<K>['data']): void;
    /**
     * Clear all listeners (use with caution).
     */
    clear(): void;
}
/** Global singleton event bus instance */
export declare const eventBus: EventBus;
