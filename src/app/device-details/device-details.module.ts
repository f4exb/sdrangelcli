import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceDetailsComponent } from './device-details.component';
import { AirspyhfComponent } from './airspyhf/airspyhf.component';
import { DeviceNotSupportedComponent } from './device-not-supported/device-not-supported.component';
import { DeviceDetailsRoutingModule } from './device-details-routing.module';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { RtlsdrComponent } from './rtlsdr/rtlsdr.component';
import { TestsourceComponent } from './testsource/testsource.component';
import { HackrfInputComponent } from './hackrf-input/hackrf-input.component';
import { HackrfOutputComponent } from './hackrf-output/hackrf-output.component';
import { LimesdrInputComponent } from './limesdr-input/limesdr-input.component';
import { CommonComponentsModule } from '../common-components/common-components.module';
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
import { RemoteInputComponent } from './remote-input/remote-input.component';
import { KiwisdrComponent } from './kiwisdr/kiwisdr.component';
import { RemoteOutputComponent } from './remote-output/remote-output.component';
import { Sdrplayv3Component } from './sdrplayv3/sdrplayv3.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatSelectModule,
    MatOptionModule,
    MatCheckboxModule,
    MatTooltipModule,
    CommonComponentsModule,
    DeviceDetailsRoutingModule
  ],
  declarations: [
    DeviceDetailsComponent,
    AirspyhfComponent,
    DeviceNotSupportedComponent,
    RtlsdrComponent,
    TestsourceComponent,
    HackrfInputComponent,
    HackrfOutputComponent,
    LimesdrInputComponent,
    LimesdrOutputComponent,
    PlutosdrInputComponent,
    PlutosdrOutputComponent,
    PerseusComponent,
    AirspyComponent,
    Bladerf1InputComponent,
    Bladerf2InputComponent,
    FcdproComponent,
    FcdproplusComponent,
    XtrxInputComponent,
    XtrxOutputComponent,
    Bladerf1OutputComponent,
    Bladerf2OutputComponent,
    SdrplayComponent,
    RemoteInputComponent,
    KiwisdrComponent,
    RemoteOutputComponent,
    Sdrplayv3Component
  ]
})
export class DeviceDetailsModule { }
