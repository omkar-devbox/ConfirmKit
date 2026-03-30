import { Directive, HostListener, Input, Output, EventEmitter, inject } from '@angular/core';
import { ConfirmService } from '../services/confirm.service';
import { ConfirmOptions } from '@confirmation-box/core';

@Directive({
  selector: '[confirmTrigger]',
  standalone: true
})
export class ConfirmTriggerDirective {
  private confirmService = inject(ConfirmService);

  @Input('confirmTrigger') options!: ConfirmOptions;
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  @HostListener('click', ['$event'])
  async onClick(event: Event) {
    event.preventDefault(); // Stop default button/anchor behavior naturally
    event.stopPropagation();
    
    const result = await this.confirmService.confirm(this.options);
    if (result) {
      this.confirmed.emit();
    } else {
      this.cancelled.emit();
    }
  }
}
