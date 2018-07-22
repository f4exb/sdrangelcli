import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstanceSummaryComponent } from './instance-summary/instance-summary.component';
import { LocationDialogComponent } from './location-dialog/location-dialog.component';
import { LoggingDialogComponent } from './logging-dialog/logging-dialog.component';
import { RemoveDevicesetDialogComponent } from './remove-deviceset-dialog/remove-deviceset-dialog.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [InstanceSummaryComponent, LocationDialogComponent, LoggingDialogComponent, RemoveDevicesetDialogComponent]
})
export class MainModule { }
