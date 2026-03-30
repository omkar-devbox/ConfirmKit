import { Directive, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[confirmFocusTrap]',
  standalone: true
})
export class FocusTrapDirective implements AfterViewInit, OnDestroy {
  private focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex="0"], [contenteditable]';
  private firstEl!: HTMLElement;
  private lastEl!: HTMLElement;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    // Timeout ensures UI is fully rendered before query
    setTimeout(() => {
      const els = this.el.nativeElement.querySelectorAll(this.focusableElementsString);
      if (els.length === 0) return;

      this.firstEl = els[0] as HTMLElement;
      this.lastEl = els[els.length - 1] as HTMLElement;
      
      this.firstEl.focus();
      this.el.nativeElement.addEventListener('keydown', this.handleTabKey);
    });
  }

  private handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) { // Shift + Tab
      if (document.activeElement === this.firstEl) {
        this.lastEl.focus();
        e.preventDefault();
      }
    } else { // Tab
      if (document.activeElement === this.lastEl) {
        this.firstEl.focus();
        e.preventDefault();
      }
    }
  };

  ngOnDestroy() {
    this.el.nativeElement.removeEventListener('keydown', this.handleTabKey);
  }
}
