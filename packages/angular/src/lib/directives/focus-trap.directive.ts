import {
  Directive,
  ElementRef,
  Input,
  AfterViewInit,
  OnDestroy,
  HostListener,
  Inject,
  NgZone
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Directive({
  selector: '[focusTrap]',
  standalone: true
})
export class FocusTrapDirective implements AfterViewInit, OnDestroy {

  @Input() focusTrap = true;

  /**
   * initial focus target:
   * - 'confirm'
   * - 'cancel'
   * - CSS selector
   */
  @Input() initialFocus?: 'confirm' | 'cancel' | string;

  /**
   * Restore focus to previously focused element
   */
  @Input() restoreFocus = true;

  /**
   * Auto focus first element if nothing matches
   */
  @Input() autoFocus = true;

  private previouslyFocusedElement: HTMLElement | null = null;
  private mutationObserver?: MutationObserver;

  constructor(
    private el: ElementRef<HTMLElement>,
    private zone: NgZone,
    @Inject(DOCUMENT) private document: Document
  ) { }

  // =========================
  // Lifecycle
  // =========================

  ngAfterViewInit(): void {
    if (!this.focusTrap) return;

    this.previouslyFocusedElement = this.document.activeElement as HTMLElement;

    // run outside angular for performance
    this.zone.runOutsideAngular(() => {
      setTimeout(() => {
        this.setInitialFocus();
        this.neutralizeBackground(true);
        this.watchDomChanges();
      });
    });
  }

  ngOnDestroy(): void {
    if (!this.focusTrap) return;

    this.mutationObserver?.disconnect();
    this.neutralizeBackground(false);

    if (this.restoreFocus && this.previouslyFocusedElement) {
      this.previouslyFocusedElement.focus();
    }
  }

  // =========================
  // Keyboard Handling
  // =========================

  @HostListener('keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent): void {
    if (!this.focusTrap) return;

    if (event.key === 'Tab') {
      this.handleTab(event);
    }
  }

  // =========================
  // Focus Logic
  // =========================

  private setInitialFocus(): void {
    const root = this.el.nativeElement;
    let target: HTMLElement | null = null;

    // Priority-based focus resolution
    if (this.initialFocus === 'confirm') {
      target = root.querySelector('[data-role="confirm"]');
    } else if (this.initialFocus === 'cancel') {
      target = root.querySelector('[data-role="cancel"]');
    } else if (this.initialFocus) {
      target = root.querySelector(this.initialFocus);
    }

    if (!target && this.autoFocus) {
      const focusable = this.getFocusableElements();
      target =
        focusable.find(el => el.getAttribute('data-role') === 'confirm') ||
        focusable[0] ||
        root;
    }

    target?.focus();
  }

  private handleTab(event: KeyboardEvent): void {
    const focusable = this.getFocusableElements();

    if (focusable.length === 0) {
      event.preventDefault();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = this.document.activeElement as HTMLElement;

    if (event.shiftKey) {
      if (active === first || active === this.el.nativeElement) {
        last.focus();
        event.preventDefault();
      }
    } else {
      if (active === last) {
        first.focus();
        event.preventDefault();
      }
    }
  }

  private getFocusableElements(): HTMLElement[] {
    const root = this.el.nativeElement;

    const selector = `
      button:not([disabled]),
      [href],
      input:not([disabled]),
      select:not([disabled]),
      textarea:not([disabled]),
      [tabindex]:not([tabindex="-1"])
    `;

    return Array.from(root.querySelectorAll<HTMLElement>(selector))
      .filter(el =>
        !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length)
      );
  }

  // =========================
  // Dynamic Support (🔥 important)
  // =========================

  private watchDomChanges(): void {
    this.mutationObserver = new MutationObserver(() => {
      // if focused element removed → re-focus
      const active = this.document.activeElement as HTMLElement;
      if (!this.el.nativeElement.contains(active)) {
        this.setInitialFocus();
      }
    });

    this.mutationObserver.observe(this.el.nativeElement, {
      childList: true,
      subtree: true
    });
  }

  // =========================
  // Accessibility (A11Y)
  // =========================

  private neutralizeBackground(active: boolean): void {
    const body = this.document.body;
    const children = Array.from(body.children);

    children.forEach(child => {
      if (child.contains(this.el.nativeElement)) return;

      if (active) {
        if (!child.hasAttribute('aria-hidden')) {
          child.setAttribute('aria-hidden', 'true');
          child.setAttribute('data-cb-hidden', 'true');
        }
      } else {
        if (child.getAttribute('data-cb-hidden') === 'true') {
          child.removeAttribute('aria-hidden');
          child.removeAttribute('data-cb-hidden');
        }
      }
    });
  }
}