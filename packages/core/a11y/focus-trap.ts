import { getDocument } from '../utils/ssr'

const FOCUSABLE_SELECTORS = [
    'a[href]',
    'button:not([disabled])',
    'textarea:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
].join(',')

function isVisible(el: HTMLElement) {
    return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length)
}

type Trap = {
    container: HTMLElement
    handler: (e: KeyboardEvent) => void
    observer: MutationObserver
}

export function createFocusTrap() {
    const traps = new Map<HTMLElement, Trap>()

    function getFocusable(container: HTMLElement) {
        return Array.from(
            container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
        ).filter(isVisible)
    }

    return {
        trap: (container: HTMLElement) => {
            const doc = getDocument()
            if (!doc || traps.has(container)) return

            const focusable = () => getFocusable(container)

            const handler = (e: KeyboardEvent) => {
                if (e.key !== 'Tab') return

                const elements = focusable()
                if (!elements.length) {
                    container.setAttribute('tabindex', '-1')
                    container.focus()
                    return
                }

                const first = elements[0]
                const last = elements[elements.length - 1]
                const active = doc.activeElement as HTMLElement | null

                if (e.shiftKey) {
                    if (active === first || !container.contains(active)) {
                        e.preventDefault()
                        last.focus()
                    }
                } else {
                    if (active === last) {
                        e.preventDefault()
                        first.focus()
                    }
                }
            }

            const observer = new MutationObserver(() => {
                const doc = getDocument()
                if (!doc || !container.isConnected) return

                const active = doc.activeElement as HTMLElement | null
                if (!active || !container.contains(active)) {
                    const elements = focusable()
                    elements[0]?.focus() ?? container.focus()
                }
            })

            observer.observe(container, { childList: true, subtree: true })
            container.addEventListener('keydown', handler)

            traps.set(container, { container, handler, observer })

            queueMicrotask(() => {
                const elements = focusable()
                elements[0]?.focus() ?? container.focus()
            })
        },

        release: (container?: HTMLElement) => {
            if (!container) {
                traps.forEach(t => {
                    t.container.removeEventListener('keydown', t.handler)
                    t.observer.disconnect()
                })
                traps.clear()
                return
            }

            const trap = traps.get(container)
            if (!trap) return

            trap.container.removeEventListener('keydown', trap.handler)
            trap.observer.disconnect()
            traps.delete(container)
        }
    }
}

export type FocusTrapInstance = ReturnType<typeof createFocusTrap>