import {
  Injectable,
  Injector,
  Type,
  isDevMode
} from '@angular/core';

import {
  CONFIRM_UI,
  DEFAULT_CONFIRM_UI
} from '../injection/confirm-ui.token';

import { ConfirmOptions } from '../models/confirm.model';

@Injectable({
  providedIn: 'root'
})
export class ConfirmUiStrategy {

  constructor(private injector: Injector) { }

  /**
   * Resolves UI component for confirmation dialog
   *
   * Priority:
   * 1. Per-call config UI
   * 2. Global CONFIRM_UI
   * 3. DEFAULT_CONFIRM_UI (mandatory fallback)
   */
  resolve(
    options: ConfirmOptions,
    injector: Injector = this.injector
  ): Type<any> {

    // 1. Options-level UI (strongest priority)
    const optionUi = this.getOptionUi(options);
    if (optionUi) return optionUi;

    // 2. Global UI from DI
    const globalUi = injector.get<Type<any> | null>(CONFIRM_UI, null);
    if (globalUi) return globalUi;

    // 3. Default UI (mandatory fallback)
    const defaultUi = injector.get<Type<any> | null>(DEFAULT_CONFIRM_UI, null);
    if (defaultUi) return defaultUi;

    // ❌ Critical failure (should never happen in proper setup)
    return this.handleResolutionError();
  }

  // =========================
  // Private Helpers
  // =========================

  private getOptionUi(options: ConfirmOptions): Type<any> | null {
    const ui = options?.ui;

    return this.isComponent(ui) ? ui : null;
  }

  private isComponent(value: unknown): value is Type<any> {
    return typeof value === 'function';
  }

  private handleResolutionError(): Type<any> {
    const message =
      '[ConfirmationBox]: UI resolution failed. DEFAULT_CONFIRM_UI must be provided.';

    if (isDevMode()) {
      throw new Error(message);
    }

    console.error(message);

    // fallback (keeps app running but signals serious misconfiguration)
    return class EmptyFallbackComponent { };
  }
}