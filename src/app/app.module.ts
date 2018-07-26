import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card'
import { MatTooltipModule, MatDialogModule, MatOptionModule, MatSelectModule, MatCheckboxModule, MatSnackBarModule, MatDividerModule } from '@angular/material';

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
import { AddDevicesetDialogComponent } from './main/add-deviceset-dialog/add-deviceset-dialog.component';
import { AudioOutComponent } from './main/audio-out/audio-out.component';
import { AudioOutDeviceComponent } from './main/audio-out-device/audio-out-device.component';
import { AudioInComponent } from './main/audio-in/audio-in.component';
import { AudioInDeviceComponent } from './main/audio-in-device/audio-in-device.component';
import { AudioOutDialogComponent } from './main/audio-out-dialog/audio-out-dialog.component';
import { AudioInDialogComponent } from './main/audio-in-dialog/audio-in-dialog.component';
import { AddChannelDialogComponent } from './deviceset/add-channel-dialog/add-channel-dialog.component';
import { ChangeDeviceDialogComponent } from './deviceset/change-device-dialog/change-device-dialog.component';
import { RemoveChannelDialogComponent } from './deviceset/remove-channel-dialog/remove-channel-dialog.component';
import { LoadPresetDialogComponent } from './deviceset/load-preset-dialog/load-preset-dialog.component';
import { SavePresetDialogComponent } from './deviceset/save-preset-dialog/save-preset-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    InstanceSummaryComponent,
    LocationDialogComponent,
    LoggingDialogComponent,
    RemoveDevicesetDialogComponent,
    AddDevicesetDialogComponent,
    DevicesetComponent,
    DeviceComponent,
    ChannelComponent,
    AudioOutComponent,
    AudioOutDeviceComponent,
    AudioOutDialogComponent,
    AudioInComponent,
    AudioInDeviceComponent,
    AudioInDialogComponent,
    AddChannelDialogComponent,
    ChangeDeviceDialogComponent,
    RemoveChannelDialogComponent,
    LoadPresetDialogComponent,
    SavePresetDialogComponent
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
    MatDividerModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    LocationDialogComponent,
    LoggingDialogComponent,
    RemoveDevicesetDialogComponent,
    AddDevicesetDialogComponent,
    AudioOutDialogComponent,
    AudioInDialogComponent,
    AddChannelDialogComponent,
    ChangeDeviceDialogComponent,
    RemoveChannelDialogComponent,
    LoadPresetDialogComponent,
    SavePresetDialogComponent
  ]
})
export class AppModule { }
