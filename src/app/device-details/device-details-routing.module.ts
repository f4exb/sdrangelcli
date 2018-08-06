import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import { DeviceDetailsComponent } from './device-details.component';
import { AirspyhfComponent } from './airspyhf/airspyhf.component';
import { DeviceNotSupportedComponent } from './device-not-supported/device-not-supported.component';
import { RtlsdrComponent } from './rtlsdr/rtlsdr.component';
import { TestsourceComponent } from './testsource/testsource.component';
import { HackrfInputComponent } from './hackrf-input/hackrf-input.component';

export const routes: Routes = [
  {
    path: '',
    component: DeviceDetailsComponent,
    children: [
      {
        path: 'airspyhf',
        component: AirspyhfComponent
      },
      {
        path: 'hackrfin',
        component: HackrfInputComponent
      },
      {
        path: 'rtlsdr',
        component: RtlsdrComponent
      },
      {
        path: 'testsource',
        component: TestsourceComponent
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