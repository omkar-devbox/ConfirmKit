import type {
    ConfirmInput,
    ConfirmOptions,
    ConfirmContext
} from './types'

import { createController } from './engine/confirm.controller'
import { createState } from './engine/confirm.state'
import { createQueue } from './engine/confirm.queue'
import { createRenderer } from './dom/renderer'
import { createScrollLock } from './a11y/scroll-lock'
import { createFocusRestorer } from './a11y/focus-restore'
import { createFocusTrap } from './a11y/focus-trap'
import { createKeyboardHandler } from './a11y/keyboard'
import { createPortalManager } from './dom/portal'
import { invariant } from './utils/invariant'

// ================================
// CONSTANTS
// ================================

const DEFAULT_CONFIRM_TEXT = 'OK'
const DEFAULT_CANCEL_TEXT = 'Cancel'

// ================================
// NORMALIZE (STRICT)
// ================================

function normalize<
    C extends ConfirmContext,
    R,
    TVariant extends string = never
>(
    input: ConfirmInput<C, R, TVariant>
): ConfirmOptions<C, R, TVariant> {
    const base: ConfirmOptions<C, R, TVariant> = {
        confirmText: DEFAULT_CONFIRM_TEXT,
        cancelText: DEFAULT_CANCEL_TEXT,
        closeOnEsc: true
    }

    if (typeof input === 'string') {
        return {
            ...base,
            message: input
        } as ConfirmOptions<C, R, TVariant>
    }

    return {
        ...base,
        ...input,
        context: (input.context ?? {}) as C
    }
}

// ================================
// FACTORY
// ================================

export interface CreateConfirmKitOptions<TVariant extends string = never> {
    presets?: Record<TVariant, any>
}

export function createConfirmKit<
    C extends ConfirmContext = ConfirmContext,
    R = boolean,
    TCustomVariants extends string = never
>(config: CreateConfirmKitOptions<TCustomVariants> = {}) {
    const state = createState<C, R, TCustomVariants>()
    const queue = createQueue<C, R, TCustomVariants>()
    const portal = createPortalManager()
    const renderer = createRenderer(portal)

    const scrollLock = createScrollLock()
    const focusRestorer = createFocusRestorer()
    const focusTrap = createFocusTrap()
    const keyboard = createKeyboardHandler()

    const controller = createController<C, R, TCustomVariants>({
        state,
        queue,
        renderer,
        scrollLock,
        focusRestorer,
        focusTrap,
        keyboard,
        portal,
        presets: config.presets
    })

    let hasRenderer = false

    return {
        confirm: (input: ConfirmInput<C, R, TCustomVariants>): Promise<R> => {
            invariant(hasRenderer, 'Renderer not set. Call setRenderer() first.')
            return controller.open(normalize<C, R, TCustomVariants>(input))
        },

        setRenderer: (
            adapter: import('./dom/renderer').RendererAdapter
        ) => {
            renderer.setAdapter(adapter)
            hasRenderer = true
        },

        confirmAction: controller.confirmAction,
        cancelAction: controller.cancelAction,

        subscribe: state.subscribe,
        getState: state.getState,

        patchContext: controller.patchContext,
        setLoading: controller.setLoading,

        destroy: controller.destroy
    }
}

export type ConfirmKitInstance = ReturnType<typeof createConfirmKit>

// ================================
// DEFAULT INSTANCE (SAFE)
// ================================

const defaultKit = createConfirmKit<ConfirmContext, boolean>()

export function confirm<C extends ConfirmContext = ConfirmContext>(
    input: ConfirmInput<C, boolean>
): Promise<boolean> {
    return defaultKit.confirm(input as ConfirmInput<ConfirmContext, boolean>)
}

export function setRenderer(
    adapter: import('./dom/renderer').RendererAdapter
) {
    defaultKit.setRenderer(adapter)
}