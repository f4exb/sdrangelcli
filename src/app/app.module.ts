import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card'
import { MatTooltipModule, MatDialogModule, MatOptionModule, MatSelectModule } from '@angular/material';

import { AppComponent } from './app.component';
import { InstanceSummaryComponent } from './main/instance-summary/instance-summary.component';
import { DevicesetComponent } from './deviceset/deviceset/deviceset.component';
import { DeviceComponent } from './deviceset/device/device.component';
import { ChannelComponent } from './deviceset/channel/channel.component';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { LocationDialogComponent } from './main/location-dialog/location-dialog.component';
import { LoggingDialogComponent } from './main/logging-dialog/logging-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    InstanceSummaryComponent,
    LocationDialogComponent,
    LoggingDialogComponent,
    DevicesetComponent,
    DeviceComponent,
    ChannelComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatTooltipModule,
    MatDialogModule,
    MatOptionModule,
    MatSelectModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    LocationDialogComponent,
    LoggingDialogComponent
  ]
})
export class AppModule { }
