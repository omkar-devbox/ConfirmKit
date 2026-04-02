import type { ConfirmState, ConfirmContext } from '../types'

export interface InternalState<
    C extends ConfirmContext = ConfirmContext,
    R = unknown,
    TVariant extends string = never
> extends ConfirmState<C, R, TVariant> {
    _resolve: (value: R) => void
    _reject: (error: unknown) => void
}

export type StateListener<
    C extends ConfirmContext,
    R = unknown,
    TVariant extends string = never
> = (state: InternalState<C, R, TVariant> | null) => void

export function createState<
    C extends ConfirmContext = ConfirmContext,
    R = unknown,
    TVariant extends string = never
>() {
    let state: InternalState<C, R, TVariant> | null = null
    const listeners = new Set<StateListener<C, R, TVariant>>()

    function emit() {
        for (const l of listeners) {
            try {
                l(state)
            } catch { }
        }
    }

    return {
        getState: () => state,

        setState: (next: InternalState<C, R, TVariant>) => {
            state = Object.freeze(next)
            emit()
        },

        updateState: (updater: (prev: InternalState<C, R, TVariant>) => InternalState<C, R, TVariant>) => {
            if (!state) return
            state = Object.freeze(updater(state))
            emit()
        },

        clearState: () => {
            state = null
            emit()
        },

        subscribe: (listener: StateListener<C, R, TVariant>) => {
            listeners.add(listener)
            return () => listeners.delete(listener)
        },

        destroy: () => {
            listeners.clear()
            state = null
        }
    }
}

export type ConfirmStateInstance<
    C extends ConfirmContext = ConfirmContext,
    R = unknown,
    TVariant extends string = never
> = ReturnType<typeof createState<C, R, TVariant>>