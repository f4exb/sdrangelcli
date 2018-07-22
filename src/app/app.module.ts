import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card'
import { MatTooltipModule, MatDialogModule, MatOptionModule, MatSelectModule, MatCheckboxModule, MatSnackBarModule } from '@angular/material';

import { AppComponent } from './app.component';
import { InstanceSummaryComponent } from './main/instance-summary/instance-summary.component';
import { DevicesetComponent } from './deviceset/deviceset/deviceset.component';
import { DeviceComponent } from './deviceset/device/device.component';
import { ChannelComponent } from './deviceset/channel/channel.component';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { LocationDialogComponent } from './main/location-dialog/location-dialog.component';
import { LoggingDialogComponent } from './main/logging-dialog/logging-dialog.component';
import { RemoveDevicesetDialogComponent } from './main/remove-deviceset-dialog/remove-deviceset-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    InstanceSummaryComponent,
    LocationDialogComponent,
    LoggingDialogComponent,
    RemoveDevicesetDialogComponent,
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
    MatCheckboxModule,
    MatSnackBarModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    LocationDialogComponent,
    LoggingDialogComponent,
    RemoveDevicesetDialogComponent
  ]
})
export class AppModule { }
