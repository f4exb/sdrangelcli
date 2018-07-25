import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevicesetComponent } from './deviceset/deviceset.component';
import { DeviceComponent } from './device/device.component';
import { ChannelComponent } from './channel/channel.component';
import { AddChannelDialogComponent } from './add-channel-dialog/add-channel-dialog.component';
import { ChangeDeviceDialogComponent } from './change-device-dialog/change-device-dialog.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DevicesetComponent, DeviceComponent, ChannelComponent, AddChannelDialogComponent, ChangeDeviceDialogComponent]
})
export class DevicesetModule { }
