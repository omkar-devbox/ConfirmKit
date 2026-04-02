export interface VanillaRendererOptions {
    getState: () => import('@confirmkit/core').ConfirmState<any, any> | null;
    confirmAction: () => void;
    cancelAction: () => void;
}
