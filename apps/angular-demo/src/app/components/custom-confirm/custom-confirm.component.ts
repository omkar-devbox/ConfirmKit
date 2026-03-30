import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmState } from '@confirmation-box/core';

@Component({
  selector: 'app-custom-confirm',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-confirm.component.html',
  styleUrls: ['./custom-confirm.component.scss']
})
export class CustomConfirmComponent {
  @Input({ required: true }) state!: ConfirmState;
}
