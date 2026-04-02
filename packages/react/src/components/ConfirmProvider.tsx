import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { createConfirmKit } from '@confirmkit/core';
import { ConfirmContext, ConfirmContextValue } from '../context/ConfirmContext';
import { ReactConfirmInput, ReactConfirmState, ReactConfirmOptions } from '../types/react.types';
import { ConfirmDialog } from './ConfirmDialog';
import { createReactRenderer } from '../adapter/ReactRenderer';

export interface ConfirmProviderProps<T extends string = never> {
    children: React.ReactNode;
    presets?: Record<T, any>;
}

export function ConfirmProvider<
    C extends Record<string, unknown> = Record<string, unknown>,
    R = boolean,
    T extends string = never
>({ children, presets }: ConfirmProviderProps<T>) {
    // 1. Initialize core kit
    const kit = useMemo(() => createConfirmKit<C, R, T>({ presets }), [presets]);

    // 2. Local state to track core state changes
    const [state, setState] = useState<ReactConfirmState<C, R, T> | null>(() => kit.getState() as any);

    // 3. Register React renderer
    useEffect(() => {
        const renderer = createReactRenderer({
            getState: () => kit.getState() as any,
            confirmAction: kit.confirmAction,
            cancelAction: kit.cancelAction
        });
        kit.setRenderer(renderer);
    }, [kit]);

    // 4. Subscribe to state changes
    useEffect(() => {
        const unsubscribe = kit.subscribe((nextState) => {
            setState(nextState as any);
        });
        return () => {
            unsubscribe();
        };
    }, [kit]);

    // 5. Wrap confirm API
    const confirm = useCallback(async (input: ReactConfirmInput<C, R, T>) => {
        const normalizedInput = typeof input === 'string' 
            ? input 
            : {
                ...input,
                message: input.message || (input as ReactConfirmOptions<C, R, T>).description || ''
            };
        return kit.confirm(normalizedInput as any);
    }, [kit]);

    const contextValue = useMemo<ConfirmContextValue<C, R, T>>(() => ({
        confirm,
        getState: () => kit.getState() as any
    }), [confirm, kit]);

    return (
        <ConfirmContext.Provider value={contextValue as any}>
            {children}
            {state && state.status !== 'idle' && (
                <ConfirmDialog 
                    state={state}
                    confirmAction={kit.confirmAction}
                    cancelAction={kit.cancelAction}
                />
            )}
        </ConfirmContext.Provider>
    );
}
