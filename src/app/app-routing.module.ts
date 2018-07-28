import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InstanceSummaryComponent} from './main/instance-summary/instance-summary.component';
import { AudioOutComponent } from './main/audio-out/audio-out.component';
import { AudioInComponent } from './main/audio-in/audio-in.component';
import { PresetsComponent } from './main/presets/presets.component';
import { DeviceDetailsComponent } from './device-details/device-details.component';
import { AirspyhfComponent } from './device-details/airspyhf/airspyhf.component';
import { DeviceNotSupportedComponent } from './device-details/device-not-supported/device-not-supported.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'summary'
    },
    {
        path: 'summary',
        component: InstanceSummaryComponent
    },
    {
        path: 'audio/out',
        component: AudioOutComponent
    },
    {
        path: 'audio/in',
        component: AudioInComponent
    },
    {
        path: 'presets',
        component: PresetsComponent
    },
    // {
    //     path: 'device/:dix',
    //     component: DeviceDetailsComponent,
    //     children: [
    //         {path: 'airspyhf', component: AirspyhfComponent},
    //         {path: 'notsupported', component: DeviceNotSupportedComponent},
    //     ]
    // },
    {
        path: 'device/:dix',
        loadChildren: './device-details/device-details.module#DeviceDetailsModule'
    }
  ];

  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
  })
  export class AppRoutingModule {
  }