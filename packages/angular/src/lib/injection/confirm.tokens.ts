import { InjectionToken } from '@angular/core';
import { ConfirmGlobalConfig } from '@confirmation-box/core';
import { ConfirmUIConfig } from '../models/confirm-ui.model';

/**
 * Injection token for global confirmation box configuration.
 */
export const CONFIRM_CONFIG = new InjectionToken<AngularConfirmConfig>('CONFIRM_CONFIG');

/**
 * Interface for Angular-specific global configuration.
 * Extends the core global configuration.
 */
export interface AngularConfirmConfig extends ConfirmGlobalConfig {
  /**
   * Global UI styling configuration.
   */
  ui?: ConfirmUIConfig;

  /**
   * Whether to close on backdrop click by default.
   */
  closeOnBackdropClick?: boolean;
}
