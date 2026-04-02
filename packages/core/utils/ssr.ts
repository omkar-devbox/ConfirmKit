export const isSSR =
    typeof window === 'undefined' || typeof document === 'undefined'

let _doc: Document | undefined
let _win: Window | undefined
let _body: HTMLElement | undefined

export function getWindow() {
    if (isSSR) return undefined
    return _win || (_win = window)
}

export function getDocument() {
    if (isSSR) return undefined
    return _doc || (_doc = document)
}

export function getBody() {
    if (isSSR) return undefined
    return _body || (_body = document.body)
}