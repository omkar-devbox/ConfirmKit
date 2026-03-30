//================================
//  Public API Registry
// ================================

// Types (Refined & Type-Safe)
export * from './types/confirm.types';
export * from './types/button.types';
export * from './types/context.types';
export * from './types/common.types';

// Core Service (Singleton)
export { confirmService, ConfirmService } from './api/confirm.api';

// State Management (Singleton)
export { confirmStore, ConfirmStore } from './store/confirm.store';

// Configuration (Singleton)
export { confirmConfig, ConfirmConfig, type ConfirmGlobalConfig } from './config/confirm.config';

// Event System (Singleton)
export { eventBus, EventBus } from './events/event.bus';

// Workflow Managers (Singletons)
export { handlerManager, HandlerManager } from './lifecycle/confirm.handler';
export { queueManager, QueueManager } from './queue/queue.manager';

// Context Management
export { ContextManager } from './context/context.manager';

// Utilities
export { createId } from './utils/create-id';
