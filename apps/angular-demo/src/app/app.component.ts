import { Component } from '@angular/core';
import { ConfirmService } from '@confirmation-box/angular';
import { ConfirmOptions, ConfirmState } from '@confirmation-box/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent {
  title = 'ConfirmKit Demo';
  logs: string[] = [];
  
  // Expose the ConfirmState manually to allow the template to react
  // in real-time to the current dialog, showing how developers can read state.

  constructor(public confirmService: ConfirmService) { }

  // Case 1: Basic confirm (service)
  async showBasicConfirm() {
    this.log('Triggering basic confirm...');
    const result = await this.confirmService.confirm({
      title: 'Delete Item',
      description: 'Are you sure you want to delete this item? This action cannot be undone.',
      confirmText: 'Yes, Delete',
      cancelText: 'Cancel'
    });
    this.log(`Basic confirm result: ${result}`);
  }

  // Case 2: Directive usage
  directiveOptions: ConfirmOptions = {
    title: 'Directive Confirm',
    description: 'This was triggered via a structural/attribute-like directive!',
    confirmText: 'Got it'
  };

  onConfirmed() {
    this.log(`Directive confirmed!`);
  }

  onCancelled() {
    this.log('Directive cancelled');
  }

  // Case 3: Async API action (Headless handling)
  async showAsyncConfirm() {
    this.log('Triggering async confirm...');
    const result = await this.confirmService.confirm({
      title: 'Async API Action',
      description: 'Clicking Process will log a result. You can handle asynchronous actions directly before or after the await.',
      confirmText: 'Process',
      cancelText: 'Cancel'
    });
    
    if (result) {
      this.log('Handler started (1s delay)...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.log('Handler finished. Action completed.');
    } else {
      this.log('Action cancelled.');
    }
  }

  // Case 4: Promise-based Multi-step Flow
  async showMultiStep() {
    this.log('Triggering basic multi-step confirm...');
    
    const step1 = await this.confirmService.confirm({
      title: 'Step 1: Terms',
      description: 'Do you agree to our terms of service?',
      confirmText: 'Agree & Next',
      cancelText: 'Reject'
    });

    if (!step1) {
      this.log('User rejected at Step 1.');
      return;
    }

    const step2 = await this.confirmService.confirm({
      title: 'Step 2: Confirm',
      description: 'Ready to create your account?',
      confirmText: 'Finish',
      cancelText: 'Back'
    });

    this.log(`Multi-step completed. Final result: ${step2}`);
  }

  // Case 5: Built-in Queue Engine Test
  showQueueTest() {
    this.log('Triggering 3 confirms rapidly to test internal Core queueing...');
    [1, 2, 3].forEach(i => {
      this.confirmService.confirm({
        title: `Queued Dialog ${i}`,
        description: `I am dialog #${i} in the queue. Press OK to see the next one.`,
        confirmText: 'OK',
        cancelText: 'Dismiss'
      }).then(res => this.log(`Dialog ${i} resolved with: ${res}`));
    });
  }

  // Case 6: Custom UI Rendering via Template context Let-Binding
  async showCustomUI() {
    this.log('Triggering custom UI injection...');
    const result = await this.confirmService.confirm({
      title: 'Premium Experience',
      description: 'This dialog uses a custom glassmorphic template bound dynamically via the confirm-outlet ng-template.',
      data: { useCustomTheme: true },
      confirmText: 'Excellent',
      cancelText: 'Close'
    });
    this.log(`Custom UI result: ${result}`);
  }

  // Case 9: Image Support (handled via Data payload)
  async showImageConfirm() {
    this.log('Triggering data payload confirm...');
    const result = await this.confirmService.confirm({
      title: 'Success!',
      description: 'Your action was processed successfully.',
      data: { image: 'confirm-success.png' },
      confirmText: 'Close'
    });
    this.log(`Image confirm result: ${result}`);
  }

  private log(message: string) {
    const time = new Date().toLocaleTimeString();
    this.logs.unshift(`[${time}] ${message}`);
    console.log(message);
  }

  clearLogs() {
    this.logs = [];
  }
}
