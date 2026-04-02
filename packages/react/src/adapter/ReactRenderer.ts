import { RendererAdapter } from '@confirmkit/core';
import { ReactRendererOptions } from '../types/react.types';

/**
 * React adapter for the core renderer.
 * In React, we handle most of the UI logic inside the Provider and Dialog components,
 * so this adapter serves as a signal bridge.
 */
export function createReactRenderer(options: ReactRendererOptions): RendererAdapter {
    return {
        mount: () => {
            // In React, the Provider handles the "mount" by rendering the Dialog component
            // when the state status is not 'idle'.
        },
        update: () => {
            // React handles updates naturally via state subscriptions in the Provider.
        },
        unmount: () => {
            // React handles "unmount" by not rendering the Dialog component
            // when the status is 'idle'.
        }
    };
}
