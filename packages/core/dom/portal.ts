import { getDocument, getBody } from '../utils/ssr'

export interface PortalOptions {
    target?: HTMLElement
    zIndex?: number
}

export function createPortalManager(options: PortalOptions = {}) {
    let portalEl: HTMLElement | null = null

    function resolveTarget() {
        return options.target ?? getBody()
    }

    function applyStyles(el: HTMLElement) {
        el.style.position = 'fixed'
        el.style.top = '0'
        el.style.left = '0'
        el.style.width = '100%'
        el.style.height = '100%'
        el.style.zIndex = String(options.zIndex ?? 1000)
        el.style.pointerEvents = 'none'
    }

    function ensurePortal(): HTMLElement | null {
        const doc = getDocument()
        const target = resolveTarget()
        if (!doc || !target) return null

        // 🔥 self-healing: recreate if removed externally
        if (portalEl && target.contains(portalEl)) {
            return portalEl
        }

        const el = doc.createElement('div')
        el.setAttribute('data-confirmkit-portal', '')
        applyStyles(el)

        target.appendChild(el)
        portalEl = el
        return el
    }

    return {
        getPortal: ensurePortal,

        removePortal: () => {
            if (!portalEl) return
            portalEl.remove()
            portalEl = null
        }
    }
}

export type PortalManagerInstance = ReturnType<typeof createPortalManager>