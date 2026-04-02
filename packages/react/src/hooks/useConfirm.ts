import { useContext } from 'react';
import { ConfirmContext, ConfirmContextValue } from '../context/ConfirmContext';

/**
 * Hook to access the confirm() function.
 */
export function useConfirm(): ConfirmContextValue['confirm'] {
    const context = useContext(ConfirmContext);
    if (!context) {
        throw new Error('useConfirm must be used within a ConfirmProvider');
    }
    return context.confirm;
}
