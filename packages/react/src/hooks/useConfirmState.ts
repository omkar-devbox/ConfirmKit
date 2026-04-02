import { useContext } from 'react';
import { ConfirmContext } from '../context/ConfirmContext';
import { ReactConfirmState } from '../types/react.types';

/**
 * Hook to access the current confirmation state.
 */
export function useConfirmState(): ReactConfirmState<any, any, any> | null {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error('useConfirmState must be used within a ConfirmProvider');
    }
    return context.getState();
}
