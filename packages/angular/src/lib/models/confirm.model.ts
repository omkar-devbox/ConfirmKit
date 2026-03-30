import { Type } from '@angular/core';
import { 
  ConfirmOptions as CoreOptions, 
  ConfirmButton, 
  ConfirmContext, 
  ConfirmState,
  ConfirmStep as CoreStep,
  ConfirmBehavior,
  ConfirmHooks
} from '@confirmation-box/core';
import { ConfirmUIConfig } from './confirm-ui.model';

/**
 * Extended ConfirmOptions for Angular to support strict UI component injection.
 */
export interface ConfirmOptions<
  T = any,
  C extends ConfirmContext = ConfirmContext
> extends Omit<CoreOptions<T, C>, 'ui'> {
  /** 
   * Custom UI component to render. 
   * If provided, it overrides both the global UI and the default fallback.
   */
  ui?: Type<any> | ConfirmUIConfig;
  /** Optional image URL to display in the dialog */
  image?: string;
}

export interface ConfirmStep<
  T = any,
  C extends ConfirmContext = ConfirmContext
> extends Omit<CoreStep<T, C>, 'image'> {
  /** Optional image URL for this step */
  image?: string;
}

export type { 
  ConfirmButton, 
  ConfirmContext, 
  ConfirmState,
  ConfirmBehavior,
  ConfirmUIConfig,
  ConfirmHooks
};
