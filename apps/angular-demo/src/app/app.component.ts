import { Component } from '@angular/core';
import { ConfirmService, CONFIRM_UI, ConfirmOptions, ConfirmContext } from '@confirmation-box/angular';
import { CustomConfirmComponent } from './components/custom-confirm/custom-confirm.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent {
  title = 'Confirmation Box Demo';
  logs: string[] = [];
  isGlobalCustom = false;

  constructor(private confirmService: ConfirmService) { }

  // Case 1: Basic confirm (service)
  async showBasicConfirm() {
    this.log('Triggering basic confirm...');
    const result = await this.confirmService.confirm({
      title: 'Delete Item',
      message: 'Are you sure you want to delete this item?',
      buttons: [
        { id: 'cancel', label: 'Cancel', role: 'cancel', variant: 'secondary' },
        { id: 'confirm', label: 'Delete', role: 'confirm', variant: 'danger', value: 'deleted' }
      ]
    });
    this.log(`Basic confirm result: ${result}`);
  }

  // Case 2: Directive usage
  directiveOptions: ConfirmOptions = {
    title: 'Directive Confirm',
    message: 'This was triggered via a directive!',
    buttons: [
      { id: 'ok', label: 'Got it', role: 'confirm', variant: 'primary', value: 'ok' }
    ]
  };

  onConfirmed(result: any) {
    this.log(`Directive confirmed: ${result}`);
  }

  onCancelled() {
    this.log('Directive cancelled');
  }

  // Case 3: Async action
  async showAsyncConfirm() {
    this.log('Triggering async confirm...');
    const result = await this.confirmService.confirm({
      title: 'Async API Action',
      message: 'This action simulates a network delay with a loading state.',
      buttons: [
        { id: 'cancel', label: 'Cancel', role: 'cancel' },
        {
          id: 'confirm',
          label: 'Process',
          role: 'confirm',
          variant: 'success',
          value: 'completed',
          action: async (ctx) => {
            this.log('Handler started (2s delay)...');
            ctx.setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 2000));
            this.log('Handler finished.');
            return; // autoClose is true by default
          }
        }
      ]
    });
    this.log(`Async confirm result: ${result}`);
  }

  // Case 4: Multi-step confirm
  async showMultiStep() {
    this.log('Triggering basic multi-step confirm...');
    const result = await this.confirmService.confirm({
      title: 'Account Setup',
      steps: [
        {
          id: 'step1',
          title: 'Step 1: Terms',
          message: 'Do you agree to our terms of service?',
          buttons: [
            { id: 'no', label: 'Reject', role: 'cancel' },
            { id: 'yes', label: 'Agree & Next', action: (ctx) => ctx.next() }
          ]
        },
        {
          id: 'step2',
          title: 'Step 2: Confirm',
          message: 'Ready to create your account?',
          buttons: [
            { id: 'back', label: 'Back', action: (ctx) => ctx.back() },
            { id: 'finish', label: 'Finish', role: 'confirm', value: 'account-created' }
          ]
        }
      ]
    });
    this.log(`Multi-step result: ${result}`);
  }

  // Case 10: Advanced Multi-step (Modern)
  async showAdvancedMultiStep() {
    this.log('Triggering advanced modern multi-step flow...');
    const result = await this.confirmService.confirm({
      title: 'Project Configuration',
      ui: { variant: 'modern' },
      behavior: { initialFocus: 'confirm' },
      steps: [
        {
          id: 'general',
          title: 'General Settings',
          message: 'Please review the initial project configuration before proceeding.',
          buttons: [
            { id: 'cancel', label: 'Cancel', role: 'cancel' },
            { id: 'next', label: 'Configure UI →', action: (ctx) => ctx.next() }
          ]
        },
        {
          id: 'ui-settings',
          title: 'UI Preferences',
          message: 'Choose your preferred design system for this project.',
          buttons: [
            { id: 'back', label: '← Back', action: (ctx) => ctx.back() },
            { id: 'modern', label: 'Next: Deployment', action: (ctx) => ctx.next() }
          ]
        },
        {
          id: 'deploy',
          title: 'Final Deployment',
          message: (ctx: any) => ctx.context['statusMessage'] || 'All settings are saved. Ready to deploy to production?',
          buttons: [
            { id: 'back', label: 'Change Settings', action: (ctx) => ctx.back() },
            { 
              id: 'confirm', 
              label: '🚀 Launch Project', 
              role: 'confirm', 
              value: 'deployed-success',
              action: async (ctx) => {
                this.log('Deploying project...');
                ctx.setLoading(true);
                await new Promise(resolve => setTimeout(resolve, 2000));
                this.log('Deployment successful! Closing in 1s...');
                
                // Update context for dynamic message feedback
                ctx.updateContext({ statusMessage: '✅ Project successfully deployed to production!' } as any);

                await new Promise(resolve => setTimeout(resolve, 1000));
                ctx.close('deployed-success');
              }
            }
          ]
        }
      ]
    });
    this.log(`Advanced multi-step result: ${result}`);
  }

  // Case 5: Queue test
  showQueueTest() {
    this.log('Triggering 3 confirms rapidly to test queue...');
    [1, 2, 3].forEach(i => {
      this.confirmService.confirm({
        title: `Queued Dialog ${i}`,
        message: `I am dialog #${i} in the queue. Press OK to see the next one.`,
        buttons: [
          { id: 'ok', label: 'OK', role: 'confirm', value: i }
        ]
      }).then(res => this.log(`Dialog ${i} resolved with: ${res}`));
    });
  }
  // Case 6: Custom UI (per call)
  async showCustomUI() {
    this.log('Triggering custom UI (per-call)...');
    const result = await this.confirmService.confirm({
      ui: CustomConfirmComponent,
      title: 'Premium Experience',
      message: 'This dialog uses a custom glassmorphic component passed directly in the confirm() call.',
      buttons: [
        { id: 'cancel', label: 'Close', role: 'cancel' },
        { id: 'ok', label: 'Excellent', role: 'confirm', variant: 'primary', value: 'premium' }
      ]
    });
    this.log(`Custom UI result: ${result}`);
  }

  // Case 7: Fallback Test (Default UI)
  async showFallbackDemo() {
    this.log('Triggering fallback demo (Default UI)...');
    const result = await this.confirmService.confirm({
      title: 'Default Fallback',
      message: 'This uses the mandatory DefaultConfirmComponent because no custom UI was provided.',
      buttons: [
        { id: 'ok', label: 'Got it', role: 'confirm', value: 'fallback-ok' }
      ]
    });
    this.log(`Fallback result: ${result}`);
  }

  // Case 8: Custom UI with Multi-step
  async showCustomMultiStep() {
    this.log('Triggering custom multi-step...');
    const result = await this.confirmService.confirm({
      ui: CustomConfirmComponent,
      title: 'Setup Wizard',
      steps: [
        {
          title: 'Advanced Setup (1/2)',
          message: 'This wizard uses the custom glassmorphic UI across all steps.',
          buttons: [
            { id: 'cancel', label: 'Exit', role: 'cancel' },
            { id: 'next', label: 'Continue', variant: 'primary', action: (ctx: ConfirmContext) => ctx['next']() }
          ],
          image: 'confirm-success.png' as any // Also testing image in custom component steps
        } as any,
        {
          title: 'Final Confirmation (2/2)',
          message: 'Everything looks good! Ready to deploy?',
          buttons: [
            { id: 'back', label: 'Back', action: (ctx: ConfirmContext) => ctx['back']() },
            { id: 'confirm', label: 'Deploy Now', role: 'confirm', variant: 'success', value: 'deployed' }
          ]
        }
      ]
    });
    this.log(`Custom multi-step result: ${result}`);
  }

  // Case 9: Image Support
  async showImageConfirm() {
    this.log('Triggering image confirm...');
    const result = await this.confirmService.confirm({
      title: 'Success!',
      message: 'Your action was processed successfully.',
      image: 'confirm-success.png',
      buttons: [
        { id: 'ok', label: 'Close', role: 'confirm', variant: 'success', value: 'ok' }
      ]
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
