import {
  Component,
  ViewChild,
  ViewContainerRef,
  OnInit,
  Injector,
  Type,
  ChangeDetectionStrategy,
  ComponentRef
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreAdapter } from '../../core-adapter/confirm.adapter';
import { ConfirmUiStrategy } from '../../services/confirm-ui-strategy.service';
import { confirmService } from '@confirmation-box/core';

@Component({
  selector: 'confirm-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `<ng-container #container></ng-container>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDialogComponent implements OnInit {
  @ViewChild('container', { read: ViewContainerRef, static: true }) container!: ViewContainerRef;
  
  private componentRef: ComponentRef<any> | null = null;

  constructor(
    private adapter: CoreAdapter,
    private uiStrategy: ConfirmUiStrategy,
    private injector: Injector
  ) {}

  ngOnInit(): void {
    this.renderUI();
  }

  /**
   * Resolves and renders the target UI component.
   */
  private renderUI(): void {
    const state = this.adapter.state;
    if (!state.options) return;

    // Resolve UI via Strategy
    const componentType = this.uiStrategy.resolve(state.options, this.injector);
    
    this.container.clear();
    this.componentRef = this.container.createComponent(componentType);
    
    // Explicitly pass data/actions as per requirements
    const instance = this.componentRef.instance;
    
    // Direct property injection (Fallback for components not using DI)
    instance.state = state;
    instance.context = state.context;
    instance.actions = {
      handleAction: (buttonId: string) => confirmService.handleAction(buttonId),
      confirm: (buttonId: string) => confirmService.handleAction(buttonId),
      close: (result: any = null) => confirmService.close(result),
      next: () => confirmService.next(),
      back: () => confirmService.back(),
      goTo: (step: string | number) => confirmService.goTo(step)
    };

    // If component has ngOnInit, it will be called by Angular after createComponent
  }
}
