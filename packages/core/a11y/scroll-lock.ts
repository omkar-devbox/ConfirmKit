import { getWindow, getBody, getDocument } from '../utils/ssr'

interface ScrollRegistry {
    count: number
    scrollY: number
    originalStyles: Record<string, string>
}

const registryMap = new WeakMap<Document, ScrollRegistry>()

function getRegistry(doc: Document): ScrollRegistry {
    let r = registryMap.get(doc)
    if (!r) {
        r = { count: 0, scrollY: 0, originalStyles: {} }
        registryMap.set(doc, r)
    }
    return r
}

function getScrollbarWidth() {
    const win = getWindow()
    const doc = getDocument()
    if (!win || !doc) return 0
    return win.innerWidth - doc.body.clientWidth
}

export function createScrollLock() {
    let isLocked = false

    return {
        lock: () => {
            if (isLocked) return

            const body = getBody()
            const win = getWindow()
            const doc = getDocument()
            if (!body || !win || !doc) return

            const registry = getRegistry(doc)

            isLocked = true
            registry.count++

            if (registry.count === 1) {
                registry.scrollY = win.scrollY

                registry.originalStyles = {
                    position: body.style.position,
                    top: body.style.top,
                    left: body.style.left,
                    right: body.style.right,
                    width: body.style.width,
                    overflow: body.style.overflow,
                    paddingRight: body.style.paddingRight
                }

                const sbWidth = getScrollbarWidth()

                body.style.position = 'fixed'
                body.style.top = `-${registry.scrollY}px`
                body.style.left = '0'
                body.style.right = '0'
                body.style.width = '100%'
                body.style.overflow = 'hidden'

                if (sbWidth > 0) {
                    body.style.paddingRight = `${sbWidth}px`
                }
            }
        },

        unlock: () => {
            if (!isLocked) return

            const body = getBody()
            const win = getWindow()
            const doc = getDocument()
            if (!body || !win || !doc) return

            const registry = getRegistry(doc)

            isLocked = false
            registry.count = Math.max(0, registry.count - 1)

            if (registry.count === 0) {
                Object.entries(registry.originalStyles).forEach(([k, v]) => {
                    (body.style as any)[k] = v ?? ''
                })

                win.scrollTo(0, registry.scrollY)
                registry.originalStyles = {}
            }
        }
    }
}

export type ScrollLockInstance = ReturnType<typeof createScrollLock>