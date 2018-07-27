import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstanceSummaryComponent } from './instance-summary/instance-summary.component';
import { LocationDialogComponent } from './location-dialog/location-dialog.component';
import { LoggingDialogComponent } from './logging-dialog/logging-dialog.component';
import { RemoveDevicesetDialogComponent } from './remove-deviceset-dialog/remove-deviceset-dialog.component';
import { AddDevicesetDialogComponent } from './add-deviceset-dialog/add-deviceset-dialog.component';
import { AudioOutComponent } from './audio-out/audio-out.component';
import { AudioOutDeviceComponent } from './audio-out-device/audio-out-device.component';
import { AudioInDeviceComponent } from './audio-in-device/audio-in-device.component';
import { AudioInComponent } from './audio-in/audio-in.component';
import { AudioOutDialogComponent } from './audio-out-dialog/audio-out-dialog.component';
import { AudioInDialogComponent } from './audio-in-dialog/audio-in-dialog.component';
import { PresetComponent } from './preset/preset.component';
import { PresetGroupComponent } from './preset-group/preset-group.component';
import { PresetsComponent } from './presets/presets.component';
import { RemovePresetDialogComponent } from './remove-preset-dialog/remove-preset-dialog.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    InstanceSummaryComponent,
    LocationDialogComponent,
    LoggingDialogComponent,
    RemoveDevicesetDialogComponent,
    AddDevicesetDialogComponent,
    AudioOutComponent,
    AudioOutDeviceComponent,
    AudioInDeviceComponent,
    AudioInComponent,
    AudioOutDialogComponent,
    AudioInDialogComponent,
    PresetComponent,
    PresetGroupComponent,
    PresetsComponent,
    RemovePresetDialogComponent
  ]
})
export class MainModule { }
