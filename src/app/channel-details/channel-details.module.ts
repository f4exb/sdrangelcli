import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelNotSupportedComponent } from './channel-not-supported/channel-not-supported.component';
import { AmDemodComponent } from './am-demod/am-demod.component';
import { ChannelDetailsComponent } from './channel-details.component';
import { FormsModule } from '@angular/forms';
import { MatCardModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatTooltipModule, MatProgressBarModule } from '@angular/material';
import { ChannelDetailsRoutingModule } from './channel-details-routing.module';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { ColorPickerModule } from 'ngx-color-picker';
import { ChannelHeaderComponent } from './channel-header/channel-header.component';
import { ChannelMonitorComponent } from './channel-monitor/channel-monitor.component';
import { NfmDemodComponent } from './nfm-demod/nfm-demod.component';
import { SsbDemodComponent } from './ssb-demod/ssb-demod.component';
import { BfmDemodComponent } from './bfm-demod/bfm-demod.component';
import { DsdDemodComponent } from './dsd-demod/dsd-demod.component';
import { WfmDemodComponent } from './wfm-demod/wfm-demod.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatSelectModule,
    MatOptionModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatProgressBarModule,
    ChannelDetailsRoutingModule,
    CommonComponentsModule,
    ColorPickerModule
  ],
  declarations: [
    ChannelNotSupportedComponent,
    AmDemodComponent,
    ChannelDetailsComponent,
    ChannelHeaderComponent,
    ChannelMonitorComponent,
    NfmDemodComponent,
    SsbDemodComponent,
    BfmDemodComponent,
    DsdDemodComponent,
    WfmDemodComponent
  ]
})
export class ChannelDetailsModule { }
