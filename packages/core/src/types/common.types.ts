//================================
// Basic Utility Types
//================================

/** Nullable value */
export type Nullable<T> = T | null;

/** Supports sync OR async return */
export type Maybe<T> = T | Promise<T>;

/** Async or Sync return */
export type AsyncOrSync<T = unknown> = T | Promise<T>;

/** Deeply readonly object */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends (infer U)[]
  ? DeepReadonly<U>[]
  : T[P] extends object
  ? DeepReadonly<T[P]>
  : T[P];
};

//================================
// Function Types
//================================

/** Safe function type */
export type AnyFunction = (...args: unknown[]) => unknown;

//================================
// Core Identity
//================================

/** Unique identifier */
export type Id = string;

//================================
// Device & Layout
//================================

export type DeviceType = 'mobile' | 'desktop' | 'auto';

export type Position =
  | 'center'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'fullscreen'
  | string;

export type Size =
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | number
  | string;

//================================
// Keyboard System
//================================

/** Action triggered by key press */
export type KeyAction =
  | 'confirm'
  | 'cancel'
  | 'close'
  | 'next'
  | 'prev'
  | 'back'
  | string;

/** Key combination (e.g. "Ctrl+S", "Enter") */
export type KeyCombo = string;

/** Mapping: key → action */
export type KeyboardMap = Partial<Record<KeyCombo, KeyAction>>;

//================================
// Observer System
//================================

export interface Subscriber<T> {
  (value: T): void;
}

export interface Unsubscribe {
  (): void;
}

//================================
// Event System (Strictly Typed)
//================================

/** Registry of all core events and their payloads */
export interface ConfirmEventRegistry {
  'confirm:open': { id: string; options: any };
  'confirm:close': { id: string; result: any };
  'confirm:step': { id: string; step: number; prevStep: number };
  'action:start': { buttonId?: string; value: any };
  'action:success': { buttonId?: string; value: any };
  'action:error': { buttonId?: string; error: any };
  'context:update': { path?: string; value: any; next: any };
  'queue:update': { size: number };
}

export type ConfirmEventType = keyof ConfirmEventRegistry;

/** Strictly typed event payload */
export interface EventPayload<K extends ConfirmEventType = ConfirmEventType> {
  type: K;
  data: ConfirmEventRegistry[K];
  timestamp: number;
}

/** Strictly typed event handler */
export interface EventHandler<K extends ConfirmEventType = ConfirmEventType> {
  (event: EventPayload<K>): void;
}

//================================
// Queue & State Types
//================================

export type Status = 'idle' | 'pending' | 'success' | 'error';

/** Result wrapper for internals */
export interface Result<T = unknown> {
  success: boolean;
  data?: T;
  error?: unknown;
}

/** Nested optional recursive type */
export type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;
