import { invariant } from '../utils/invariant'
import type { PortalManagerInstance } from './portal'

export interface RendererAdapter {
    mount: (el: HTMLElement) => void
    update?: () => void
    unmount: () => void
}

export function createRenderer(portalManager: PortalManagerInstance) {
    let adapter: RendererAdapter | null = null
    let mountedEl: HTMLElement | null = null

    return {
        setAdapter: (next: RendererAdapter) => {
            if (mountedEl) throw new Error('Cannot change adapter after mount')
            adapter = next
        },

        render: () => {
            invariant(adapter, 'Renderer adapter is missing.')

            const portal = portalManager.getPortal()
            if (!portal) return

            if (mountedEl === portal) {
                adapter.update?.()
                return
            }

            adapter.mount(portal)
            mountedEl = portal
        },

        unmount: () => {
            if (!mountedEl) return
            adapter?.unmount()
            mountedEl = null
        }
    }
}

export type RendererInstance = ReturnType<typeof createRenderer>