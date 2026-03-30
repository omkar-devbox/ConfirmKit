import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { ConfirmOutletComponent, ConfirmTriggerDirective, DefaultConfirmDialogComponent } from '@confirmation-box/angular';
import { AppComponent } from './app.component';
import { CustomConfirmComponent } from './components/custom-confirm/custom-confirm.component';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CommonModule,
    ConfirmOutletComponent,
    ConfirmTriggerDirective,
    DefaultConfirmDialogComponent,
    CustomConfirmComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
