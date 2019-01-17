import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { DeviceDetailsComponent } from './device-details.component';
import { AirspyhfComponent } from './airspyhf/airspyhf.component';
import { DeviceNotSupportedComponent } from './device-not-supported/device-not-supported.component';
import { RtlsdrComponent } from './rtlsdr/rtlsdr.component';
import { TestsourceComponent } from './testsource/testsource.component';
import { HackrfInputComponent } from './hackrf-input/hackrf-input.component';
import { HackrfOutputComponent } from './hackrf-output/hackrf-output.component';
import { LimesdrInputComponent } from './limesdr-input/limesdr-input.component';
import { LimesdrOutputComponent } from './limesdr-output/limesdr-output.component';
import { PlutosdrInputComponent } from './plutosdr-input/plutosdr-input.component';
import { PlutosdrOutputComponent } from './plutosdr-output/plutosdr-output.component';
import { PerseusComponent } from './perseus/perseus.component';
import { AirspyComponent } from './airspy/airspy.component';
import { Bladerf1InputComponent } from './bladerf1-input/bladerf1-input.component';
import { Bladerf2InputComponent } from './bladerf2-input/bladerf2-input.component';
import { FcdproComponent } from './fcdpro/fcdpro.component';
import { FcdproplusComponent } from './fcdproplus/fcdproplus.component';
import { XtrxInputComponent } from './xtrx-input/xtrx-input.component';
import { XtrxOutputComponent } from './xtrx-output/xtrx-output.component';
import { Bladerf1OutputComponent } from './bladerf1-output/bladerf1-output.component';
import { Bladerf2OutputComponent } from './bladerf2-output/bladerf2-output.component';
import { SdrplayComponent } from './sdrplay/sdrplay.component';

export const routes: Routes = [
  {
    path: '',
    component: DeviceDetailsComponent,
    children: [
      {
        path: 'airspy',
        component: AirspyComponent
      },
      {
        path: 'airspyhf',
        component: AirspyhfComponent
      },
      {
        path: 'bladerf1in',
        component: Bladerf1InputComponent
      },
      {
        path: 'bladerf1out',
        component: Bladerf1OutputComponent
      },
      {
        path: 'bladerf2in',
        component: Bladerf2InputComponent
      },
      {
        path: 'bladerf2out',
        component: Bladerf2OutputComponent
      },
      {
        path: 'fcdpro',
        component: FcdproComponent
      },
      {
        path: 'fcdproplus',
        component: FcdproplusComponent
      },
      {
        path: 'hackrfin',
        component: HackrfInputComponent
      },
      {
        path: 'hackrfout',
        component: HackrfOutputComponent
      },
      {
        path: 'limesdrin',
        component: LimesdrInputComponent
      },
      {
        path: 'limesdrout',
        component: LimesdrOutputComponent
      },
      {
        path: 'perseus',
        component: PerseusComponent
      },
      {
        path: 'plutosdrin',
        component: PlutosdrInputComponent
      },
      {
        path: 'plutosdrout',
        component: PlutosdrOutputComponent
      },
      {
        path: 'rtlsdr',
        component: RtlsdrComponent
      },
      {
        path: 'sdrplay1',
        component: SdrplayComponent
      },
      {
        path: 'testsource',
        component: TestsourceComponent
      },
      {
        path: 'xtrxin',
        component: XtrxInputComponent
      },
      {
        path: 'xtrxout',
        component: XtrxOutputComponent
      },
      {
        path: 'notsupported',
        component: DeviceNotSupportedComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class DeviceDetailsRoutingModule {
}
