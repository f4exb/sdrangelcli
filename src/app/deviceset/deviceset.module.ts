import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevicesetComponent } from './deviceset/deviceset.component';
import { DeviceComponent } from './device/device.component';
import { ChannelComponent } from './channel/channel.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DevicesetComponent, DeviceComponent, ChannelComponent]
})
export class DevicesetModule { }
