export interface ConfirmOptions<TData = any, TContext = any> {
  title?: string;
  description?: string;
  data?: TData;         // Custom payload to pass around
  context?: TContext;   // Meta context for UI rendering variations
  confirmText?: string;
  cancelText?: string;
}

export interface ConfirmState<TData = any, TContext = any> extends ConfirmOptions<TData, TContext> {
  id: string;
  isOpen: boolean;
  resolve: (value: boolean) => void;
  reject: (reason?: any) => void;
}
