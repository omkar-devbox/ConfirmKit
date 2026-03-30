import { Directive, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { ConfirmOptions } from '../models/confirm.model';
import { ConfirmService } from '../services/confirm.service';

@Directive({
  selector: '[confirm]',
  standalone: true
})
export class ConfirmDirective {
  /**
   * Confirmation options to be passed to the confirm service.
   */
  @Input('confirm') options!: ConfirmOptions;

  /**
   * Emitted when the user confirms the action.
   */
  @Output() confirmed = new EventEmitter<any>();

  /**
   * Emitted when the user cancels the action.
   */
  @Output() cancelled = new EventEmitter<void>();

  constructor(private confirmService: ConfirmService) {}

  @HostListener('click', ['$event'])
  async onClick(event: MouseEvent): Promise<void> {
    event.preventDefault();
    event.stopPropagation();

    try {
      const result = await this.confirmService.confirm(this.options);
      
      if (result !== null && result !== undefined) {
        this.confirmed.emit(result);
      } else {
        this.cancelled.emit();
      }
    } catch (error) {
      this.cancelled.emit();
    }
  }
}
