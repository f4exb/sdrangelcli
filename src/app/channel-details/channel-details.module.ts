import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelNotSupportedComponent } from './channel-not-supported/channel-not-supported.component';
import { AmDemodComponent } from './am-demod/am-demod.component';
import { ChannelDetailsComponent } from './channel-details.component';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
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
import { AmModComponent } from './am-mod/am-mod.component';
import { CwKeyerComponent } from './cw-keyer/cw-keyer.component';
import { NfmModComponent } from './nfm-mod/nfm-mod.component';
import { WfmModComponent } from './wfm-mod/wfm-mod.component';
import { SsbModComponent } from './ssb-mod/ssb-mod.component';
import { UdpSinkComponent } from './udp-sink/udp-sink.component';
import { UdpSourceComponent } from './udp-source/udp-source.component';
import { RemoteSourceComponent } from './remote-source/remote-source.component';
import { RemoteSinkComponent } from './remote-sink/remote-sink.component';
import { FreeDVModComponent } from './freedv-mod/freedv-mod.component';
import { FreeDVDemodComponent } from './freedv-demod/freedv-demod.component';
import { FreqtrackerSinkComponent } from './freqtracker-sink/freqtracker-sink.component';
import { LocalSinkComponent } from './local-sink/local-sink.component';
import { LocalSourceComponent } from './local-source/local-source.component';
import { FileSinkComponent } from './file-sink/file-sink.component';
import { SigmfFileSinkComponent } from './sigmf-file-sink/sigmf-file-sink.component';
import { FileSourceComponent } from './file-source/file-source.component';

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
    WfmDemodComponent,
    AmModComponent,
    CwKeyerComponent,
    NfmModComponent,
    WfmModComponent,
    SsbModComponent,
    UdpSinkComponent,
    UdpSourceComponent,
    RemoteSourceComponent,
    RemoteSinkComponent,
    FreeDVModComponent,
    FreeDVDemodComponent,
    FreqtrackerSinkComponent,
    LocalSinkComponent,
    LocalSourceComponent,
    FileSinkComponent,
    SigmfFileSinkComponent,
    FileSourceComponent
  ]
})
export class ChannelDetailsModule { }
