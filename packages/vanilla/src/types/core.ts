import type { ConfirmStyles } from '../types';
import type { BuiltInVariant, IconType, ConfirmOptions, ConfirmContext } from '@confirmkit/core';

export interface VanillaConfirmOptions<
    C extends ConfirmContext = ConfirmContext,
    R = boolean,
    TVariant extends string = never
> extends Omit<ConfirmOptions<C, R, TVariant>, 'title' | 'message' | 'styles'> {
    title?: string | ((ctx: C) => string)
    message?: string | ((ctx: C) => string)
    description?: string | ((ctx: C) => string)
    styles?: ConfirmStyles
}
