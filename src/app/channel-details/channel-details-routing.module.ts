import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { ChannelDetailsComponent } from './channel-details.component';
import { AmDemodComponent } from './am-demod/am-demod.component';
import { ChannelNotSupportedComponent } from './channel-not-supported/channel-not-supported.component';
import { NfmDemodComponent } from './nfm-demod/nfm-demod.component';
import { SsbDemodComponent } from './ssb-demod/ssb-demod.component';

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
        path: 'nfmdemod',
        component: NfmDemodComponent
      },
      {
        path: 'ssbdemod',
        component: SsbDemodComponent
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