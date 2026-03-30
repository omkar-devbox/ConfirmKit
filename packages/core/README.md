core/
│
├── index.ts                # public exports (entry point)
│
├── types/                  # types / interfaces
│   ├── confirm.types.ts
│   ├── button.types.ts
│   ├── context.types.ts
│   └── common.types.ts
│
├── store/                  # state management (observer pattern)
│   ├── confirm.store.ts
│   └── confirm.state.ts
│
├── service/                # public API (confirm call)
│   └── confirm.service.ts
│
├── queue/                  # queue handling
│   └── queue.manager.ts
│
├── handler/                # action handlers
│   └── handler.manager.ts
│
├── context/                # context system
│   └── context.manager.ts
│
├── events/                 # observer / pub-sub system
│   └── event.bus.ts
│
├── utils/                  # helper functions
│   ├── create-id.ts
│   ├── promise.util.ts
│   └── type.util.ts
│
└── config/                 # global configuration
    └── confirm.config.ts