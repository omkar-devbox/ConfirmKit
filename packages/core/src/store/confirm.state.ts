import { ConfirmContext } from '../types/context.types';
import { ConfirmState } from '../types/confirm.types';

/**
 * State factory for initialization and resetting.
 */
export function createInitialState<T = any, C extends ConfirmContext = ConfirmContext>(): ConfirmState<T, C> {
    return {
        isOpen: false,
        options: null,
        context: null,
        loading: false,
        step: 0,
    };
}
