import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstanceSummaryComponent } from './instance-summary/instance-summary.component';
import { LocationDialogComponent } from './location-dialog/location-dialog.component';
import { LoggingDialogComponent } from './logging-dialog/logging-dialog.component';
import { RemoveDevicesetDialogComponent } from './remove-deviceset-dialog/remove-deviceset-dialog.component';
import { AddDevicesetDialogComponent } from './add-deviceset-dialog/add-deviceset-dialog.component';
import { AudioOutComponent } from './audio-out/audio-out.component';
import { AudioOutDeviceComponent } from './audio-out-device/audio-out-device.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [InstanceSummaryComponent, LocationDialogComponent, LoggingDialogComponent, RemoveDevicesetDialogComponent, AddDevicesetDialogComponent, AudioOutComponent, AudioOutDeviceComponent]
})
export class MainModule { }
