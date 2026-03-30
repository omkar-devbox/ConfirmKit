import { ConfirmEventType, EventHandler, EventPayload } from '../types/common.types';

/**
 * Type-safe Event Bus for core library communication.
 * Prevents memory leaks by ensuring proper listener cleanup.
 */
export class EventBus {
    private listeners = new Map<ConfirmEventType, Set<EventHandler<any>>>();

    /**
     * Subscribe to a specific event type.
     * Returns an unsubscribe function.
     */
    on<K extends ConfirmEventType>(type: K, handler: EventHandler<K>): () => void {
        if (!this.listeners.has(type)) {
            this.listeners.set(type, new Set());
        }
        const handlers = this.listeners.get(type)!;
        handlers.add(handler);
        
        return () => {
            handlers.delete(handler);
            if (handlers.size === 0) {
                this.listeners.delete(type);
            }
        };
    }

    /**
     * Emit an event with proper payload and timestamp.
     */
    emit<K extends ConfirmEventType>(type: K, data: EventPayload<K>['data']): void {
        const handlers = this.listeners.get(type);
        if (!handlers) return;

        const event = {
            type,
            data,
            timestamp: Date.now(),
        } as EventPayload<K>;

        // Execute handlers safely
        for (const handler of handlers) {
            try {
                handler(event);
            } catch (error) {
                console.error(`[EventBus] Error in handler for event "${type}":`, error);
            }
        }
    }

    /**
     * Clear all listeners (use with caution).
     */
    clear(): void {
        this.listeners.clear();
    }
}

/** Global singleton event bus instance */
export const eventBus = new EventBus();
