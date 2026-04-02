import type { AsyncOrSync, DeepReadonly } from './shared.types'
import type { Status, KeyboardMap } from './system.types'

// ================================
// Context
// ================================

export type ConfirmContext = Record<string, unknown>

export type ContextUpdater<C extends ConfirmContext = ConfirmContext> =
    (prev: DeepReadonly<C>) => Partial<C>

// ================================
// Action Context (STRONG)
// ================================

export interface ActionContext<
    C extends ConfirmContext = ConfirmContext,
    R = unknown
> {
    context: DeepReadonly<C>
    close: (result: R) => Promise<R>
    setLoading: (loading: boolean) => void
    updateContext: (updater: ContextUpdater<C>) => void
    signal: AbortSignal
}

// ================================
// Button (STRICT)
// ================================

export interface ConfirmButton<
    C extends ConfirmContext = ConfirmContext,
    R = unknown
> {
    id: string
    label: string | ((ctx: ActionContext<C, R>) => string)
    action?: (ctx: ActionContext<C, R>) => AsyncOrSync<R | void>
    autoClose?: boolean
}

// ================================
// Step
// ================================

export interface ConfirmStep<C extends ConfirmContext = ConfirmContext> {
    title?: string | ((ctx: C) => string)
    message?: string | ((ctx: C) => string)
    buttons?: ConfirmButton<C>[]
}

// ================================
// Variants & Icons
// ================================

export type BuiltInVariant = 'success' | 'error' | 'warning' | 'info'

export type IconType =
    | BuiltInVariant
    | string
    | HTMLElement

/**
 * Representation of a style preset. 
 * Can be typed specifically by the renderer.
 */
export type ConfirmPreset = any

// ================================
// MAIN OPTIONS (STRICT)
// ================================

export interface ConfirmOptions<
    C extends ConfirmContext = ConfirmContext,
    R = unknown,
    TVariant extends string = never
> {
    title?: string | ((ctx: C) => string)
    message?: string | ((ctx: C) => string)

    confirmText?: string
    cancelText?: string

    onConfirm?: (ctx: C, signal: AbortSignal) => AsyncOrSync<R | void>
    onCancel?: (ctx: C, signal: AbortSignal) => void

    buttons?: ConfirmButton<C, R>[]
    steps?: ConfirmStep<C>[]

    context?: C

    variant?: BuiltInVariant | TVariant | (string & {})
    icon?: IconType

    persistent?: boolean
    closeOnEsc?: boolean
    autoClose?: number

    keyMap?: KeyboardMap
    confirmKey?: string
    cancelKey?: string
    styles?: any
}

// ================================
// INPUT (SMART)
// ================================

export type ConfirmInput<
    C extends ConfirmContext = ConfirmContext,
    R = unknown,
    TVariant extends string = never
> =
    | string
    | ConfirmOptions<C, R, TVariant>

// ================================
// STATE
// ================================

export interface ConfirmState<
    C extends ConfirmContext = ConfirmContext,
    R = unknown,
    TVariant extends string = never
> {
    status: Status
    context: C
    loading: boolean
    step: number
    options: ConfirmOptions<C, R, TVariant>
    presets?: Record<TVariant, any>
}