import { Component, ContentChild, TemplateRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmService } from '../services/confirm.service';
import { FocusTrapDirective } from '../directives/focus-trap.directive';
import { DefaultConfirmDialogComponent } from '../default-ui/default-confirm-dialog.component';

@Component({
  selector: 'confirm-outlet',
  standalone: true,
  imports: [CommonModule, FocusTrapDirective, DefaultConfirmDialogComponent],
  template: `
    @if (confirmService.state$ | async; as state) {
      <div class="confirm-backdrop-overlay" confirmFocusTrap>
        
        <!-- Render Custom Template if provided -->
        @if (customTemplate) {
          <ng-container *ngTemplateOutlet="customTemplate; context: { $implicit: state }"></ng-container>
        } 
        
        <!-- Render Default Plugin UI if no Template provided -->
        @else {
          <confirm-default-dialog [state]="state"></confirm-default-dialog>
        }
      </div>
    }
  `,
  styles: [`
    .confirm-backdrop-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(2px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }
  `]
})
export class ConfirmOutletComponent {
  public confirmService = inject(ConfirmService);
  
  @ContentChild(TemplateRef) customTemplate?: TemplateRef<any>;
}
