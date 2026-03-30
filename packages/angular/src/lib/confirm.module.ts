import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';

import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { DefaultConfirmComponent } from './components/default-confirm/default-confirm.component';
import { ConfirmDirective } from './directives/confirm.directive';
import { ConfirmService } from './services/confirm.service';
import { ConfirmOverlayService } from './services/confirm-overlay.service';
import { CoreAdapter } from './core-adapter/confirm.adapter';
import { ConfirmUiStrategy } from './services/confirm-ui-strategy.service';
import { CONFIRM_CONFIG, AngularConfirmConfig } from './injection/confirm.tokens';
import { DEFAULT_CONFIRM_UI } from './injection/confirm-ui.token';

@NgModule({
  imports: [
    CommonModule,
    OverlayModule, 
    PortalModule,
    ConfirmDialogComponent,
    DefaultConfirmComponent,
    ConfirmDirective
  ],
  exports: [
    ConfirmDirective
  ]
})
export class ConfirmModule {
  /**
   * ForRoot method to provide global configuration.
   */
  static forRoot(config?: AngularConfirmConfig): ModuleWithProviders<ConfirmModule> {
    return {
      ngModule: ConfirmModule,
      providers: [
        ConfirmService,
        ConfirmOverlayService,
        CoreAdapter,
        ConfirmUiStrategy,
        { provide: CONFIRM_CONFIG, useValue: config || {} },
        { provide: DEFAULT_CONFIRM_UI, useValue: DefaultConfirmComponent }
      ]
    };
  }
}
