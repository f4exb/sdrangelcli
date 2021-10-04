import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AisComponent } from './ais/ais.component';
import { FeatureDetailsComponent } from './feature-details.component';
import { FeatureNotSupportedComponent } from './feature-not-supported/feature-not-supported.component';
import { Gs232ControllerComponent } from './gs232-controller/gs232-controller.component';
import { SatelliteTrackerComponent } from './satellite-tracker/satellite-tracker.component';

export const routes: Routes = [
  {
    path: '',
    component: FeatureDetailsComponent,
    children: [
      {
        path: 'ais',
        component: AisComponent
      },
      {
        path: 'gs232controller',
        component: Gs232ControllerComponent
      },
      {
        path: 'satellitetracker',
        component: SatelliteTrackerComponent
      },
      {
        path: 'notsupported',
        component: FeatureNotSupportedComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})

export class FeatureDetailsRoutingModule {
}
