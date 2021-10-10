import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { ChannelDetailsComponent } from './channel-details.component';
import { AmDemodComponent } from './am-demod/am-demod.component';
import { ChannelNotSupportedComponent } from './channel-not-supported/channel-not-supported.component';
import { NfmDemodComponent } from './nfm-demod/nfm-demod.component';
import { SsbDemodComponent } from './ssb-demod/ssb-demod.component';
import { BfmDemodComponent } from './bfm-demod/bfm-demod.component';
import { DsdDemodComponent } from './dsd-demod/dsd-demod.component';
import { WfmDemodComponent } from './wfm-demod/wfm-demod.component';
import { AmModComponent } from './am-mod/am-mod.component';
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

export const routes: Routes = [
  {
    path: '',
    component: ChannelDetailsComponent,
    children: [
      {
        path: 'amdemod',
        component: AmDemodComponent
      },
      {
        path: 'bfmdemod',
        component: BfmDemodComponent
      },
      {
        path: 'filesink',
        component: FileSinkComponent
      },
      {
        path: 'sigmffilesink',
        component: SigmfFileSinkComponent
      },
      {
        path: 'freedvdemod',
        component: FreeDVDemodComponent
      },
      {
        path: 'freqtracker',
        component: FreqtrackerSinkComponent
      },
      {
        path: 'localsink',
        component: LocalSinkComponent
      },
      {
        path: 'localsource',
        component: LocalSourceComponent
      },
      {
        path: 'remotesink',
        component: RemoteSinkComponent
      },
      {
        path: 'remotesource',
        component: RemoteSourceComponent
      },
      {
        path: 'dsddemod',
        component: DsdDemodComponent
      },
      {
        path: 'nfmdemod',
        component: NfmDemodComponent
      },
      {
        path: 'ssbdemod',
        component: SsbDemodComponent
      },
      {
        path: 'wfmdemod',
        component: WfmDemodComponent
      },
      {
        path: 'ammod',
        component: AmModComponent
      },
      {
        path: 'freedvmod',
        component: FreeDVModComponent
      },
      {
        path: 'nfmmod',
        component: NfmModComponent
      },
      {
        path: 'ssbmod',
        component: SsbModComponent
      },
      {
        path: 'udpsource',
        component: UdpSourceComponent
      },
      {
        path: 'udpsink',
        component: UdpSinkComponent
      },
      {
        path: 'wfmmod',
        component: WfmModComponent
      },
      {
        path: 'notsupported',
        component: ChannelNotSupportedComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class ChannelDetailsRoutingModule {
}
