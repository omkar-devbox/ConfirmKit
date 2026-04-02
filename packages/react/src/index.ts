export * from './components/ConfirmProvider';
export * from './components/ConfirmDialog';
export * from './hooks/useConfirm';
export * from './hooks/useConfirmState';
export * from './types/react.types';
export { defaultStyles } from './styles/defaultStyles';

import { createConfirmKit } from '@confirmkit/core';
import { ReactConfirmInput } from './types/react.types';

const defaultKit = createConfirmKit();

/**
 * Singleton confirm function for quick usage.
 */
export const confirm = (input: ReactConfirmInput<any, any, any>): Promise<any> => {
    return defaultKit.confirm(input as any);
};
