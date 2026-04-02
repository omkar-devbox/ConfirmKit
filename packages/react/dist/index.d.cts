import * as react_jsx_runtime from 'react/jsx-runtime';
import React, { ReactNode, CSSProperties } from 'react';
import { BuiltInVariant as BuiltInVariant$1, ConfirmContext, ConfirmState, ConfirmOptions } from '@confirmkit/core';

interface ConfirmProviderProps<T extends string = never> {
    children: React.ReactNode;
    presets?: Record<T, any>;
}
declare function ConfirmProvider<C extends Record<string, unknown> = Record<string, unknown>, R = boolean, T extends string = never>({ children, presets }: ConfirmProviderProps<T>): react_jsx_runtime.JSX.Element;

type BuiltInVariant = BuiltInVariant$1;
interface ConfirmStyles {
    overlay?: CSSProperties;
    container?: CSSProperties;
    title?: CSSProperties;
    description?: CSSProperties;
    actions?: CSSProperties;
    confirmButton?: CSSProperties;
    cancelButton?: CSSProperties;
    icon?: CSSProperties;
}
interface ReactConfirmOptions<C extends ConfirmContext = ConfirmContext, R = boolean, TVariant extends string = never> extends Omit<ConfirmOptions<C, R, TVariant>, 'title' | 'message' | 'styles' | 'icon'> {
    title?: ReactNode | ((ctx: C) => ReactNode);
    message?: ReactNode | ((ctx: C) => ReactNode);
    description?: ReactNode | ((ctx: C) => ReactNode);
    styles?: ConfirmStyles;
    icon?: ReactNode | BuiltInVariant | TVariant;
}
type ReactConfirmInput<C extends ConfirmContext = ConfirmContext, R = boolean, TVariant extends string = never> = string | ReactConfirmOptions<C, R, TVariant>;
interface ReactConfirmState<C extends ConfirmContext = ConfirmContext, R = boolean, TVariant extends string = never> extends Omit<ConfirmState<C, R, TVariant>, 'options'> {
    options: ReactConfirmOptions<C, R, TVariant>;
}
interface ReactRendererOptions {
    getState: () => ReactConfirmState<any, any, any> | null;
    confirmAction: () => void;
    cancelAction: () => void;
}

interface ConfirmDialogProps {
    state: ReactConfirmState<any, any, any>;
    confirmAction: () => void;
    cancelAction: () => void;
}
declare const ConfirmDialog: React.FC<ConfirmDialogProps>;

interface ConfirmContextValue<C extends Record<string, unknown> = Record<string, unknown>, R = boolean, T extends string = never> {
    confirm: (input: ReactConfirmInput<C, R, T>) => Promise<R>;
    getState: () => ReactConfirmState<C, R, T> | null;
}

/**
 * Hook to access the confirm() function.
 */
declare function useConfirm(): ConfirmContextValue['confirm'];

/**
 * Hook to access the current confirmation state.
 */
declare function useConfirmState(): ReactConfirmState<any, any, any> | null;

declare const defaultStyles: Required<ConfirmStyles>;

/**
 * Singleton confirm function for quick usage.
 */
declare const confirm: (input: ReactConfirmInput<any, any, any>) => Promise<any>;

export { type BuiltInVariant, ConfirmDialog, type ConfirmDialogProps, ConfirmProvider, type ConfirmProviderProps, type ConfirmStyles, type ReactConfirmInput, type ReactConfirmOptions, type ReactConfirmState, type ReactRendererOptions, confirm, defaultStyles, useConfirm, useConfirmState };
