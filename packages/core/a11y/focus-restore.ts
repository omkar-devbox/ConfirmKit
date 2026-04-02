import { getDocument } from '../utils/ssr'

export function createFocusRestorer() {
    let last: HTMLElement | null = null

    return {
        save() {
            const doc = getDocument()
            if (!doc) return
            last = doc.activeElement as HTMLElement
        },

        restore() {
            const doc = getDocument()
            if (!doc || !last) return

            if (doc.body.contains(last)) {
                try { last.focus() } catch { }
            }

            last = null
        }
    }
}

export type FocusRestorerInstance = ReturnType<typeof createFocusRestorer>