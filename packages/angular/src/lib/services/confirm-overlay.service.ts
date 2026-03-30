import {
  Injectable,
  Inject,
  Optional
} from '@angular/core';
import {
  Overlay,
  OverlayRef,
  OverlayConfig
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { CONFIRM_CONFIG, AngularConfirmConfig } from '../injection/confirm.tokens';
import { confirmService } from '@confirmation-box/core';

@Injectable({
  providedIn: 'root'
})
export class ConfirmOverlayService {
  private overlayRef: OverlayRef | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private overlay: Overlay,
    @Optional() @Inject(CONFIRM_CONFIG) private config?: AngularConfirmConfig
  ) { }

  /**
   * Opens confirmation dialog overlay
   */
  open(): OverlayRef {
    if (this.overlayRef) {
      this.close(); // ensure clean state
    }

    const overlayConfig = this.createOverlayConfig();
    this.overlayRef = this.overlay.create(overlayConfig);

    const portal = new ComponentPortal(ConfirmDialogComponent);
    this.overlayRef.attach(portal);

    this.handleBackdropClick();
    this.handleEscapeKey();

    return this.overlayRef;
  }

  /**
   * Closes active overlay
   */
  close(): void {
    if (!this.overlayRef) return;

    this.overlayRef.dispose();
    this.overlayRef = null;

    this.destroy$.next();
    this.destroy$.complete();
    this.destroy$ = new Subject<void>(); // reset for next open
  }

  /**
   * Returns whether overlay is open
   */
  isOpen(): boolean {
    return !!this.overlayRef;
  }

  // =========================
  // Private Methods
  // =========================

  private handleBackdropClick(): void {
    this.overlayRef?.backdropClick()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const shouldClose = this.config?.closeOnBackdropClick ?? true;
        if (shouldClose) {
          confirmService.close(null);
        }
      });
  }

  private handleEscapeKey(): void {
    this.overlayRef?.keydownEvents()
      .pipe(takeUntil(this.destroy$))
      .subscribe(event => {
        if (event.key === 'Escape') {
          confirmService.close(null);
        }
      });
  }

  private createOverlayConfig(): OverlayConfig {
    const ui = this.config?.ui ?? {};

    return new OverlayConfig({
      hasBackdrop: true,
      backdropClass: ui.overlayClass || 'cb-backdrop',
      panelClass: ui.className || 'cb-container',
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy: this.overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically()
    });
  }
}