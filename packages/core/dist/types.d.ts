export interface ConfirmOptions<TData = any, TContext = any> {
    title?: string;
    description?: string;
    data?: TData;
    context?: TContext;
    confirmText?: string;
    cancelText?: string;
}
export interface ConfirmState<TData = any, TContext = any> extends ConfirmOptions<TData, TContext> {
    id: string;
    isOpen: boolean;
    resolve: (value: boolean) => void;
    reject: (reason?: any) => void;
}
