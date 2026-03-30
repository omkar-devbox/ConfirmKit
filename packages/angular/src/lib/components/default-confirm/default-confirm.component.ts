import {
  Component,
  ChangeDetectionStrategy,
  OnInit,
  OnDestroy,
  ElementRef,
  ViewChild,
  Inject,
  Optional
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { CoreAdapter } from '../../core-adapter/confirm.adapter';
import { confirmService, ConfirmButton, ConfirmContext } from '@confirmation-box/core';
import { CONFIRM_CONFIG, AngularConfirmConfig } from '../../injection/confirm.tokens';
import { ConfirmUIConfig } from '../../models/confirm-ui.model';
import { mergeUIConfigs } from '../../utils/ui.utils';
import { Subscription, map } from 'rxjs';

import { FocusTrapDirective } from '../../directives/focus-trap.directive';
import { createId } from '@confirmation-box/core';

@Component({
  selector: 'default-confirm',
  standalone: true,
  imports: [CommonModule, FocusTrapDirective],
  templateUrl: './default-confirm.component.html',
  styleUrls: ['./default-confirm.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DefaultConfirmComponent implements OnInit, OnDestroy {
  @ViewChild('dialogContainer', { static: true }) dialogContainer!: ElementRef<HTMLElement>;

  state$;
  ui: ConfirmUIConfig = mergeUIConfigs();
  
  // Accessibility IDs
  titleId = `cb-title-${createId()}`;
  messageId = `cb-msg-${createId()}`;

  private subscription: Subscription = new Subscription();

  constructor(
    private adapter: CoreAdapter,
    @Optional() @Inject(CONFIRM_CONFIG) private config: AngularConfirmConfig,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.state$ = this.adapter.state$;
  }

  ngOnInit(): void {
    // Merged UI calculation
    this.subscription.add(
      this.state$.subscribe((state) => {
        const localUI = state.options?.ui as ConfirmUIConfig;
        this.ui = mergeUIConfigs(this.config?.ui, localUI);
      })
    );
  }

  /**
   * Handle button click action.
   */
  handleAction(button: ConfirmButton): void {
    if (button.loading) return;
    confirmService.handleAction(button.id || '');
  }

  /**
   * Keyboard event handler for Enter and Escape.
   */
  onKeyDown(event: KeyboardEvent): void {
    const state = this.adapter.state;
    if (!state.isOpen) return;

    if (event.key === 'Escape' && state.options?.behavior?.closeOnEsc !== false) {
      confirmService.close(null);
      event.preventDefault();
      return;
    }

    if (event.key === 'Enter') {
      // If a button is already focused, let it handle the enter key naturally
      if (this.document?.activeElement?.tagName === 'BUTTON') {
        return;
      }

      const buttons = this.getCurrentButtons();
      const primaryButton = buttons.find((b) => b.role === 'confirm');
      if (primaryButton && !primaryButton.disabled && !primaryButton.loading) {
        this.handleAction(primaryButton);
        event.preventDefault();
      }
    }
  }


  getCurrentButtons(): ConfirmButton[] {
    const state = this.adapter.state;
    if (!state.options) return [];
    
    const currentStep = state.options.steps?.[state.step];
    return currentStep?.buttons || state.options.buttons || [];
  }

  getTitle(): string {
    const state = this.adapter.state;
    if (!state.options) return '';

    const currentStep = state.options.steps?.[state.step];
    const title = currentStep?.title || state.options.title;

    if (typeof title === 'function') {
      return title(state.context as ConfirmContext);
    }
    return title || '';
  }

  getMessage(): string {
    const state = this.adapter.state;
    if (!state.options) return '';

    const currentStep = state.options.steps?.[state.step];
    const message = currentStep?.message || state.options.message;

    if (typeof message === 'function') {
      return message(state.context as ConfirmContext);
    }
    return message || '';
  }

  getImage(): string | undefined {
    const state = this.adapter.state;
    if (!state.options) return undefined;

    const currentStep = state.options.steps?.[state.step] as any;
    return currentStep?.image || (state.options as any).image;
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
