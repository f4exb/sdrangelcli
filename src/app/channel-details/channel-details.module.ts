import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelNotSupportedComponent } from './channel-not-supported/channel-not-supported.component';
import { AmDemodComponent } from './am-demod/am-demod.component';
import { ChannelDetailsComponent } from './channel-details.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ChannelNotSupportedComponent, AmDemodComponent, ChannelDetailsComponent]
})
export class ChannelDetailsModule { }
