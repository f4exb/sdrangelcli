import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonComponentsModule } from '../common-components/common-components.module';
import { ColorPickerModule } from 'ngx-color-picker';
import { FeatureDetailsRoutingModule } from './feature-details-routing.module';
import { FeatureNotSupportedComponent } from './feature-not-supported/feature-not-supported.component';
import { FeatureDetailsComponent } from './feature-details.component';
import { AisComponent } from './ais/ais.component';
import { FeatureHeaderComponent } from './feature-header/feature-header.component';
import { SatelliteTrackerComponent } from './satellite-tracker/satellite-tracker.component';
import { MatChipsModule } from '@angular/material/chips';

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
    MatChipsModule,
    FeatureDetailsRoutingModule,
    CommonComponentsModule,
    ColorPickerModule
  ],
  declarations: [
    FeatureDetailsComponent,
    FeatureNotSupportedComponent,
    AisComponent,
    SatelliteTrackerComponent,
    FeatureHeaderComponent,
  ]
})

export class FeatureDetailsModule { }
