import { createContext } from 'react';
import { ReactConfirmInput, ReactConfirmState } from '../types/react.types';

export interface ConfirmContextValue<
    C extends Record<string, unknown> = Record<string, unknown>,
    R = boolean,
    T extends string = never
> {
    confirm: (input: ReactConfirmInput<C, R, T>) => Promise<R>;
    getState: () => ReactConfirmState<C, R, T> | null;
}

export const ConfirmContext = createContext<ConfirmContextValue<any, any, any> | null>(null);
