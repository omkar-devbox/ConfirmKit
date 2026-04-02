import type {
    ConfirmOptions,
    ConfirmContext
} from '../types'

import { invariant } from '../utils/invariant'
import type { InternalState, ConfirmStateInstance } from './confirm.state'
import type { ConfirmQueueInstance } from './confirm.queue'
import type { RendererInstance } from '../dom/renderer'
import type { ScrollLockInstance } from '../a11y/scroll-lock'
import type { FocusRestorerInstance } from '../a11y/focus-restore'
import type { FocusTrapInstance } from '../a11y/focus-trap'
import type { KeyboardHandlerInstance } from '../a11y/keyboard'
import type { PortalManagerInstance } from '../dom/portal'

export interface ControllerDependencies<
    C extends ConfirmContext = ConfirmContext,
    R = unknown,
    TVariant extends string = never
> {
    state: ConfirmStateInstance<C, R, TVariant>
    queue: ConfirmQueueInstance<C, R, TVariant>
    renderer: RendererInstance
    scrollLock: ScrollLockInstance
    focusRestorer: FocusRestorerInstance
    focusTrap: FocusTrapInstance
    keyboard: KeyboardHandlerInstance
    portal: PortalManagerInstance
    presets?: Record<TVariant, any>
}

export function createController<
    C extends ConfirmContext = ConfirmContext,
    R = unknown,
    TVariant extends string = never
>(deps: ControllerDependencies<C, R, TVariant>) {
    const {
        state,
        queue,
        renderer,
        scrollLock,
        focusRestorer,
        focusTrap,
        keyboard,
        portal,
        presets
    } = deps

    let isAlive = true
    let activeAbortController: AbortController | null = null
    let isProcessing = false
    let isClosing = false

    // 🔥 CRITICAL FIX: async race isolation
    let requestId = 0

    // ================================
    // QUEUE PROCESSOR (SAFE)
    // ================================

    function processQueue() {
        if (!isAlive || isProcessing || state.getState()) return

        const item = queue.dequeue()
        if (!item) return

        isProcessing = true

        const { options, resolve, reject } = item

        activeAbortController = new AbortController()

        // A11Y + SIDE EFFECTS (OPEN)
        focusRestorer.save()
        scrollLock.lock()

        const internalState: InternalState<C, R, TVariant> = {
            status: 'open',
            context: (options.context ?? {}) as C,
            loading: false,
            step: 0,
            options,
            presets,
            _resolve: once(resolve),
            _reject: once(reject)
        }

        state.setState(internalState)

        renderer.render()

        const portalEl = portal.getPortal()
        if (portalEl) {
            focusTrap.trap(portalEl)

            keyboard.attach(portalEl, {
                onConfirm: confirmAction,
                onCancel: cancelAction,
                confirmKey: options.confirmKey,
                cancelKey: options.cancelKey,
                closeOnEsc: options.closeOnEsc
            })
        }

        isProcessing = false
    }

    // ================================
    // ACTIONS (RACE-SAFE)
    // ================================

    async function confirmAction() {
        if (!isAlive || isClosing) return

        const current = state.getState()
        invariant(current, 'No active confirm')

        const id = ++requestId

        try {
            setLoading(true)

            const result = await current.options.onConfirm?.(
                current.context,
                activeAbortController!.signal
            )

            // 🔥 ignore stale async resolution
            if (!isAlive || isClosing || id !== requestId) return

            close((result ?? true) as unknown as R)
        } catch (e) {
            if (!isAlive || isClosing || id !== requestId) return

            setLoading(false)
            closeByError(e)
        }
    }

    function cancelAction() {
        if (!isAlive || isClosing) return

        const current = state.getState()
        if (!current) return

        queue.clear()

        try {
            current.options.onCancel?.(
                current.context,
                activeAbortController!.signal
            )
        } catch { }

        close(false as R)
    }

    // ================================
    // CLOSE (IDEMPOTENT + SAFE)
    // ================================

    function close(result: R) {
        if (!isAlive || isClosing) return
        isClosing = true

        const current = state.getState()
        current?._resolve(result)

        cleanupAndNext()
    }

    function closeByError(error: unknown) {
        if (!isAlive || isClosing) return
        isClosing = true

        queue.clear()

        const current = state.getState()
        current?._reject(error)

        cleanupAndNext()
    }

    function cleanupAndNext() {
        try {
            activeAbortController?.abort()
        } catch { }

        activeAbortController = null

        renderer.unmount()
        scrollLock.unlock()
        focusRestorer.restore()
        keyboard.detach()

        // 🔥 SAFE RELEASE (container aware)
        const portalEl = portal.getPortal()
        if (portalEl) {
            focusTrap.release(portalEl)
        } else {
            focusTrap.release()
        }

        state.clearState()
        isClosing = false

        if (isAlive && queue.hasItems()) {
            queueMicrotask(processQueue)
        }
    }

    // ================================
    // PUBLIC API
    // ================================

    function setLoading(loading: boolean) {
        if (!isAlive) return
        const current = state.getState()
        if (!current) return

        state.setState({
            ...current,
            loading,
            status: loading ? 'loading' : 'open'
        })
    }

    return {
        open: (options: ConfirmOptions<C, R, TVariant>): Promise<R> => {
            return new Promise<R>((resolve, reject) => {
                if (!isAlive) {
                    reject(new Error('Controller destroyed'))
                    return
                }

                queue.enqueue({ options, resolve, reject })
                processQueue()
            })
        },

        confirmAction,
        cancelAction,
        close,
        setLoading,

        patchContext: (updater: (prev: C) => Partial<C>) => {
            if (!isAlive) return
            const current = state.getState()
            if (!current) return

            state.setState({
                ...current,
                context: {
                    ...current.context,
                    ...updater(current.context)
                }
            })
        },

        destroy: () => {
            if (!isAlive) return
            isAlive = false

            queue.clear()
            cleanupAndNext()
            portal.removePortal()
            state.destroy()
        }
    }
}

// ================================
// UTIL: ONCE WRAPPER (SAFE)
// ================================

function once<T extends (...args: any[]) => void>(fn: T): T {
    let called = false
    return ((...args: Parameters<T>) => {
        if (called) return
        called = true
        fn(...args)
    }) as any
}