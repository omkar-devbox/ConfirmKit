packages/core/
├── index.ts                 # public API (exports)
├── confirm.ts               # main entry (confirm() factory)

├── engine/                  # 🧠 core logic
│   ├── confirm.controller.ts # state & transition logic
│   ├── confirm.state.ts      # reactive state management
│   └── confirm.queue.ts      # sequential request handling

├── a11y/                    # ♿ accessibility primitive
│   ├── focus-trap.ts        # keyboard focus containment
│   ├── keyboard.ts          # global escape/enter handling
│   ├── scroll-lock.ts       # background scroll suppression
│   └── focus-restore.ts     # previous focus management

├── dom/                     # 🌐 DOM layer (framework-agnostic)
│   ├── portal.ts            # container management
│   └── renderer.ts          # element mounting/unmounting

├── types/                   # 🧠 type definitions
│   ├── index.ts             # type exports
│   ├── confirm.types.ts     # public config types
│   ├── system.types.ts      # internal engine types
│   └── shared.types.ts      # common primitives

├── utils/                   # ⚙️ strict helpers
│   ├── invariant.ts         # runtime assertions
│   └── ssr.ts               # environment detection