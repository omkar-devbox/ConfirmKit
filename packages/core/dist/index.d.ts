type AsyncOrSync<T = unknown> = T | Promise<T>;
type DeepReadonly<T> = T extends (infer U)[] ? ReadonlyArray<DeepReadonly<U>> : T extends Map<infer K, infer V> ? ReadonlyMap<DeepReadonly<K>, DeepReadonly<V>> : T extends Set<infer U> ? ReadonlySet<DeepReadonly<U>> : T extends Date ? Readonly<Date> : T extends object ? {
    readonly [K in keyof T]: DeepReadonly<T[K]>;
} : T;

type Status = 'idle' | 'open' | 'loading' | 'closing';
type KeyboardMap = Partial<Record<'confirm' | 'cancel' | 'next' | 'prev', string[]>>;

type ConfirmContext = Record<string, unknown>;
type ContextUpdater<C extends ConfirmContext = ConfirmContext> = (prev: DeepReadonly<C>) => Partial<C>;
interface ActionContext<C extends ConfirmContext = ConfirmContext, R = unknown> {
    context: DeepReadonly<C>;
    close: (result: R) => Promise<R>;
    setLoading: (loading: boolean) => void;
    updateContext: (updater: ContextUpdater<C>) => void;
    signal: AbortSignal;
}
interface ConfirmButton<C extends ConfirmContext = ConfirmContext, R = unknown> {
    id: string;
    label: string | ((ctx: ActionContext<C, R>) => string);
    action?: (ctx: ActionContext<C, R>) => AsyncOrSync<R | void>;
    autoClose?: boolean;
}
interface ConfirmStep<C extends ConfirmContext = ConfirmContext> {
    title?: string | ((ctx: C) => string);
    message?: string | ((ctx: C) => string);
    buttons?: ConfirmButton<C>[];
}
type BuiltInVariant = 'success' | 'error' | 'warning' | 'info';
type IconType = BuiltInVariant | string | HTMLElement;
/**
 * Representation of a style preset.
 * Can be typed specifically by the renderer.
 */
type ConfirmPreset = any;
interface ConfirmOptions<C extends ConfirmContext = ConfirmContext, R = unknown, TVariant extends string = never> {
    title?: string | ((ctx: C) => string);
    message?: string | ((ctx: C) => string);
    confirmText?: string;
    cancelText?: string;
    onConfirm?: (ctx: C, signal: AbortSignal) => AsyncOrSync<R | void>;
    onCancel?: (ctx: C, signal: AbortSignal) => void;
    buttons?: ConfirmButton<C, R>[];
    steps?: ConfirmStep<C>[];
    context?: C;
    variant?: BuiltInVariant | TVariant | (string & {});
    icon?: IconType;
    persistent?: boolean;
    closeOnEsc?: boolean;
    autoClose?: number;
    keyMap?: KeyboardMap;
    confirmKey?: string;
    cancelKey?: string;
    styles?: any;
}
type ConfirmInput<C extends ConfirmContext = ConfirmContext, R = unknown, TVariant extends string = never> = string | ConfirmOptions<C, R, TVariant>;
interface ConfirmState<C extends ConfirmContext = ConfirmContext, R = unknown, TVariant extends string = never> {
    status: Status;
    context: C;
    loading: boolean;
    step: number;
    options: ConfirmOptions<C, R, TVariant>;
    presets?: Record<TVariant, any>;
}

interface InternalState<C extends ConfirmContext = ConfirmContext, R = unknown, TVariant extends string = never> extends ConfirmState<C, R, TVariant> {
    _resolve: (value: R) => void;
    _reject: (error: unknown) => void;
}
type StateListener<C extends ConfirmContext, R = unknown, TVariant extends string = never> = (state: InternalState<C, R, TVariant> | null) => void;

interface RendererAdapter {
    mount: (el: HTMLElement) => void;
    update?: () => void;
    unmount: () => void;
}

interface CreateConfirmKitOptions<TVariant extends string = never> {
    presets?: Record<TVariant, any>;
}
declare function createConfirmKit<C extends ConfirmContext = ConfirmContext, R = boolean, TCustomVariants extends string = never>(config?: CreateConfirmKitOptions<TCustomVariants>): {
    confirm: (input: ConfirmInput<C, R, TCustomVariants>) => Promise<R>;
    setRenderer: (adapter: RendererAdapter) => void;
    confirmAction: () => Promise<void>;
    cancelAction: () => void;
    subscribe: (listener: StateListener<C, R, TCustomVariants>) => () => boolean;
    getState: () => InternalState<C, R, TCustomVariants> | null;
    patchContext: (updater: (prev: C) => Partial<C>) => void;
    setLoading: (loading: boolean) => void;
    destroy: () => void;
};
type ConfirmKitInstance = ReturnType<typeof createConfirmKit>;
declare function confirm<C extends ConfirmContext = ConfirmContext>(input: ConfirmInput<C, boolean>): Promise<boolean>;
declare function setRenderer(adapter: RendererAdapter): void;

export { type ActionContext, type AsyncOrSync, type BuiltInVariant, type ConfirmButton, type ConfirmContext, type ConfirmInput, type ConfirmKitInstance, type ConfirmOptions, type ConfirmPreset, type ConfirmState, type ConfirmStep, type ContextUpdater, type CreateConfirmKitOptions, type DeepReadonly, type IconType, type KeyboardMap, type RendererAdapter, type Status, confirm, createConfirmKit, setRenderer };
