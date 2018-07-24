import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevicesetComponent } from './deviceset/deviceset.component';
import { DeviceComponent } from './device/device.component';
import { ChannelComponent } from './channel/channel.component';
import { AddChannelDialogComponent } from './add-channel-dialog/add-channel-dialog.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DevicesetComponent, DeviceComponent, ChannelComponent, AddChannelDialogComponent]
})
export class DevicesetModule { }
