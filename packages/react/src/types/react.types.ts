import { ReactNode, CSSProperties } from 'react';
import { 
    ConfirmOptions, 
    ConfirmContext, 
    BuiltInVariant as CoreBuiltInVariant,
    ConfirmState as CoreConfirmState
} from '@confirmkit/core';

export type BuiltInVariant = CoreBuiltInVariant;

export interface ConfirmStyles {
    overlay?: CSSProperties;
    container?: CSSProperties;
    title?: CSSProperties;
    description?: CSSProperties;
    actions?: CSSProperties;
    confirmButton?: CSSProperties;
    cancelButton?: CSSProperties;
    icon?: CSSProperties;
}

export interface ReactConfirmOptions<
    C extends ConfirmContext = ConfirmContext,
    R = boolean,
    TVariant extends string = never
> extends Omit<ConfirmOptions<C, R, TVariant>, 'title' | 'message' | 'styles' | 'icon'> {
    title?: ReactNode | ((ctx: C) => ReactNode);
    message?: ReactNode | ((ctx: C) => ReactNode);
    description?: ReactNode | ((ctx: C) => ReactNode); // Alias for message
    styles?: ConfirmStyles;
    icon?: ReactNode | BuiltInVariant | TVariant;
}

export type ReactConfirmInput<
    C extends ConfirmContext = ConfirmContext,
    R = boolean,
    TVariant extends string = never
> = string | ReactConfirmOptions<C, R, TVariant>;

export interface ReactConfirmState<
    C extends ConfirmContext = ConfirmContext,
    R = boolean,
    TVariant extends string = never
> extends Omit<CoreConfirmState<C, R, TVariant>, 'options'> {
    options: ReactConfirmOptions<C, R, TVariant>;
}

export interface ReactRendererOptions {
    getState: () => ReactConfirmState<any, any, any> | null;
    confirmAction: () => void;
    cancelAction: () => void;
}
