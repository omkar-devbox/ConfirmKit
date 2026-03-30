import { ConfirmContext } from '../types/context.types';
import { ConfirmState } from '../types/confirm.types';
/**
 * State factory for initialization and resetting.
 */
export declare function createInitialState<T = any, C extends ConfirmContext = ConfirmContext>(): ConfirmState<T, C>;
