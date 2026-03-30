import { Component, Input } from '@angular/core';
import { ConfirmState } from '@confirmation-box/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'confirm-default-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="confirm-dialog" role="dialog" aria-modal="true" [attr.aria-labelledby]="state.id + '-title'" [attr.aria-describedby]="state.id + '-desc'">
      <h2 [id]="state.id + '-title'" class="confirm-title">{{ state.title || 'Confirm Action' }}</h2>
      
      @if (state.description) {
        <p [id]="state.id + '-desc'" class="confirm-description">{{ state.description }}</p>
      }
      
      <div class="confirm-actions">
        <button type="button" class="confirm-btn confirm-btn-cancel" (click)="state.resolve(false)">
          {{ state.cancelText || 'Cancel' }}
        </button>
        <button type="button" class="confirm-btn confirm-btn-confirm" (click)="state.resolve(true)">
          {{ state.confirmText || 'Confirm' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .confirm-dialog {
      background: white;
      border-radius: 8px;
      padding: 24px;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      font-family: inherit;
    }
    .confirm-title {
      margin: 0 0 12px;
      font-size: 1.25rem;
      font-weight: 600;
      color: #111827;
    }
    .confirm-description {
      margin: 0 0 24px;
      font-size: 0.875rem;
      color: #4b5563;
      line-height: 1.5;
    }
    .confirm-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }
    .confirm-btn {
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      border: none;
      transition: background-color 0.2s;
    }
    .confirm-btn-cancel {
      background: white;
      color: #374151;
      border: 1px solid #d1d5db;
    }
    .confirm-btn-cancel:hover {
      background: #f3f4f6;
    }
    .confirm-btn-confirm {
      background: #2563eb;
      color: white;
    }
    .confirm-btn-confirm:hover {
      background: #1d4ed8;
    }
  `]
})
export class DefaultConfirmDialogComponent {
  @Input({ required: true }) state!: ConfirmState;
}
