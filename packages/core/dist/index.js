"use strict";
//================================
//  Public API Registry
// ================================
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createId = exports.ContextManager = exports.QueueManager = exports.queueManager = exports.HandlerManager = exports.handlerManager = exports.EventBus = exports.eventBus = exports.ConfirmConfig = exports.confirmConfig = exports.ConfirmStore = exports.confirmStore = exports.ConfirmService = exports.confirmService = void 0;
// Types (Refined & Type-Safe)
__exportStar(require("./types/confirm.types"), exports);
__exportStar(require("./types/button.types"), exports);
__exportStar(require("./types/context.types"), exports);
__exportStar(require("./types/common.types"), exports);
// Core Service (Singleton)
var confirm_api_1 = require("./api/confirm.api");
Object.defineProperty(exports, "confirmService", { enumerable: true, get: function () { return confirm_api_1.confirmService; } });
Object.defineProperty(exports, "ConfirmService", { enumerable: true, get: function () { return confirm_api_1.ConfirmService; } });
// State Management (Singleton)
var confirm_store_1 = require("./store/confirm.store");
Object.defineProperty(exports, "confirmStore", { enumerable: true, get: function () { return confirm_store_1.confirmStore; } });
Object.defineProperty(exports, "ConfirmStore", { enumerable: true, get: function () { return confirm_store_1.ConfirmStore; } });
// Configuration (Singleton)
var confirm_config_1 = require("./config/confirm.config");
Object.defineProperty(exports, "confirmConfig", { enumerable: true, get: function () { return confirm_config_1.confirmConfig; } });
Object.defineProperty(exports, "ConfirmConfig", { enumerable: true, get: function () { return confirm_config_1.ConfirmConfig; } });
// Event System (Singleton)
var event_bus_1 = require("./events/event.bus");
Object.defineProperty(exports, "eventBus", { enumerable: true, get: function () { return event_bus_1.eventBus; } });
Object.defineProperty(exports, "EventBus", { enumerable: true, get: function () { return event_bus_1.EventBus; } });
// Workflow Managers (Singletons)
var confirm_handler_1 = require("./lifecycle/confirm.handler");
Object.defineProperty(exports, "handlerManager", { enumerable: true, get: function () { return confirm_handler_1.handlerManager; } });
Object.defineProperty(exports, "HandlerManager", { enumerable: true, get: function () { return confirm_handler_1.HandlerManager; } });
var queue_manager_1 = require("./queue/queue.manager");
Object.defineProperty(exports, "queueManager", { enumerable: true, get: function () { return queue_manager_1.queueManager; } });
Object.defineProperty(exports, "QueueManager", { enumerable: true, get: function () { return queue_manager_1.QueueManager; } });
// Context Management
var context_manager_1 = require("./context/context.manager");
Object.defineProperty(exports, "ContextManager", { enumerable: true, get: function () { return context_manager_1.ContextManager; } });
// Utilities
var create_id_1 = require("./utils/create-id");
Object.defineProperty(exports, "createId", { enumerable: true, get: function () { return create_id_1.createId; } });
