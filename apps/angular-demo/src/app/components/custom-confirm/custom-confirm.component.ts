import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmState, ConfirmContext } from '@confirmation-box/core';

/**
 * A Premium, Glassmorphic Custom UI for the Confirmation Box.
 * Demonstrates how to use 'state', 'context', and 'actions' inputs.
 */
@Component({
  selector: 'app-custom-confirm',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-confirm.component.html',
  styleUrls: ['./custom-confirm.component.scss']
})
export class CustomConfirmComponent {
  @Input() state!: ConfirmState;
  @Input() context!: ConfirmContext;
  @Input() actions!: any;

  getTitle(): string {
    const currentStep = this.state.options?.steps?.[this.state.step];
    const title = currentStep?.title || this.state.options?.title;
    return typeof title === 'function' ? title(this.context) : (title || '');
  }

  getMessage(): string {
    const currentStep = this.state.options?.steps?.[this.state.step];
    const message = currentStep?.message || this.state.options?.message;
    return typeof message === 'function' ? message(this.context) : (message || '');
  }

  getButtons() {
    const currentStep = this.state.options?.steps?.[this.state.step];
    return currentStep?.buttons || this.state.options?.buttons || [];
  }

  handleAction(id: string) {
    this.actions.handleAction(id);
  }
}
