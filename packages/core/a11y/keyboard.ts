export type KeyboardHandlers = {
    onConfirm: () => void
    onCancel: () => void
    confirmKey?: string
    cancelKey?: string
    closeOnEsc?: boolean
}

export function createKeyboardHandler() {
    let cleanup: (() => void) | null = null

    return {
        attach: (container: HTMLElement, config: KeyboardHandlers) => {
            cleanup?.()

            const {
                onConfirm,
                onCancel,
                confirmKey = 'Enter',
                cancelKey = 'Escape',
                closeOnEsc = true
            } = config

            const handler = (e: KeyboardEvent) => {
                const target = e.target as HTMLElement

                const isInput =
                    target.tagName === 'INPUT' ||
                    target.tagName === 'TEXTAREA' ||
                    target.isContentEditable

                if (e.key === cancelKey && closeOnEsc) {
                    e.preventDefault()
                    onCancel()
                }

                if (e.key === confirmKey && !isInput) {
                    e.preventDefault()
                    onConfirm()
                }
            }

            container.addEventListener('keydown', handler)
            cleanup = () => container.removeEventListener('keydown', handler)
        },

        detach: () => {
            cleanup?.()
            cleanup = null
        }
    }
}

export type KeyboardHandlerInstance = ReturnType<typeof createKeyboardHandler>