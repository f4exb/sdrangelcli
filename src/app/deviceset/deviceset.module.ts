import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevicesetComponent } from './deviceset/deviceset.component';
import { DeviceComponent } from './device/device.component';
import { ChannelComponent } from './channel/channel.component';
import { AddChannelDialogComponent } from './add-channel-dialog/add-channel-dialog.component';
import { ChangeDeviceDialogComponent } from './change-device-dialog/change-device-dialog.component';
import { RemoveChannelDialogComponent } from './remove-channel-dialog/remove-channel-dialog.component';
import { LoadPresetDialogComponent } from './load-preset-dialog/load-preset-dialog.component';
import { SavePresetDialogComponent } from './save-preset-dialog/save-preset-dialog.component';
import { NewPresetDialogComponent } from './new-preset-dialog/new-preset-dialog.component';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule, MatDialogModule, MatOptionModule, MatSelectModule, MatCheckboxModule, MatSnackBarModule, MatDividerModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

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
    FormsModule
  ],
  declarations: [
    DevicesetComponent,
    DeviceComponent,
    ChannelComponent,
    AddChannelDialogComponent,
    ChangeDeviceDialogComponent,
    RemoveChannelDialogComponent,
    LoadPresetDialogComponent,
    SavePresetDialogComponent,
    NewPresetDialogComponent
  ],
  entryComponents: [
    AddChannelDialogComponent,
    ChangeDeviceDialogComponent,
    RemoveChannelDialogComponent,
    LoadPresetDialogComponent,
    SavePresetDialogComponent,
    NewPresetDialogComponent
  ],
  exports: [
    DevicesetComponent
  ]
})
export class DevicesetModule { }
