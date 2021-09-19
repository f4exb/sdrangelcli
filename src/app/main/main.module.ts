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
import { ImportPresetDialogComponent } from './import-preset-dialog/import-preset-dialog.component';
import { ExportPresetDialogComponent } from './export-preset-dialog/export-preset-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { DevicesetModule } from '../deviceset/deviceset.module';
import { AddFeaturesetDialogComponent } from './add-featureset-dialog/add-featureset-dialog.component';
import { RemoveFeaturesetDialogComponent } from './remove-featureset-dialog/remove-featureset-dialog.component';
import { FeaturepresetComponent } from './featurepreset/featurepreset.component';
import { RemoveFeaturePresetDialogComponent } from './remove-feature-preset-dialog/remove-feature-preset-dialog.component';
import { FeaturesetModule } from '../featureset/featureset.module';
import { FeaturepresetsComponent } from './featurepresets/featurepresets.component';
import { FeaturepresetGroupComponent } from './featurepreset-group/featurepreset-group.component';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatTooltipModule,
    MatDialogModule,
    MatOptionModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatDividerModule,
    FormsModule,
    DevicesetModule,
    FeaturesetModule
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
    RemovePresetDialogComponent,
    ImportPresetDialogComponent,
    ExportPresetDialogComponent,
    AddFeaturesetDialogComponent,
    RemoveFeaturesetDialogComponent,
    RemoveFeaturePresetDialogComponent,
    FeaturepresetsComponent,
    FeaturepresetGroupComponent,
    FeaturepresetComponent
  ],
  entryComponents: [
    LocationDialogComponent,
    LoggingDialogComponent,
    RemoveDevicesetDialogComponent,
    AddDevicesetDialogComponent,
    AudioOutDialogComponent,
    AudioOutDialogComponent,
    RemovePresetDialogComponent,
    ImportPresetDialogComponent,
    ExportPresetDialogComponent
  ]
})
export class MainModule { }
