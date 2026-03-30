import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { confirmService, ConfirmContext } from '@confirmation-box/core';

import { ConfirmOptions } from '../models/confirm.model';
import { CoreAdapter } from '../core-adapter/confirm.adapter';
import { ConfirmOverlayService } from './confirm-overlay.service';
import { ConfirmUiStrategy } from './confirm-ui-strategy.service';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService implements OnDestroy {
  private subscription = new Subscription();

  constructor(
    private adapter: CoreAdapter,
    private overlay: ConfirmOverlayService,
    private uiStrategy: ConfirmUiStrategy
  ) {
    this.initStateListener();
  }

  // =========================
  // Public API
  // =========================

  confirm<T = any, C extends ConfirmContext = ConfirmContext>(
    options: ConfirmOptions<T, C>
  ): Promise<T | null> {
    return confirmService.confirm(options as any);
  }

  next(): void {
    confirmService.next();
  }

  back(): void {
    confirmService.back();
  }

  goTo(stepIdOrIndex: string | number): void {
    confirmService.goTo(stepIdOrIndex);
  }

  close(result: any = null): void {
    confirmService.close(result);
  }

  // =========================
  // Lifecycle
  // =========================

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // =========================
  // Private Methods
  // =========================

  private initStateListener(): void {
    const sub = this.adapter.state$.subscribe(state => {
      if (state.isOpen) {
        this.handleOpen(state.options);
      } else {
        this.overlay.close();
      }
    });

    this.subscription.add(sub);
  }

  /**
   * Handles opening flow with strict null safety
   */
  private handleOpen(
    options: ConfirmOptions | null | undefined
  ): void {
    this.safeResolveUi(options);

    if (!this.overlay.isOpen()) {
      this.overlay.open();
    }
  }

  /**
   * Resolves UI safely without breaking app flow
   */
  private safeResolveUi(
    options: ConfirmOptions | null | undefined
  ): void {
    try {
      if (options) {
        this.uiStrategy.resolve(options);
      }
    } catch (error) {
      // Dev mode: log error (UiStrategy may throw)
      if (typeof ngDevMode !== 'undefined' && ngDevMode) {
        console.error('[ConfirmService] UI resolve failed:', error);
      }
    }
  }
}