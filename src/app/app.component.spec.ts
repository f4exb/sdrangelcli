import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { InstanceSummaryComponent } from './main/instance-summary/instance-summary.component';
import { MatCardModule } from '@angular/material/card';
import { DevicesetComponent } from './deviceset/deviceset/deviceset.component';
import { DeviceComponent } from './deviceset/device/device.component';
import { ChannelComponent } from './deviceset/channel/channel.component';
import { AppRoutingModule } from './app-routing.module';
import { APP_BASE_HREF } from '@angular/common';
import { MatDialogModule, MatOptionModule, MatSelectModule, MatCheckboxModule, MatSnackBarModule, MatTooltipModule } from '@angular/material';
import { AudioOutComponent } from './main/audio-out/audio-out.component';
import { AudioOutDeviceComponent } from './main/audio-out-device/audio-out-device.component';
import { AudioInComponent } from './main/audio-in/audio-in.component';
import { AudioInDeviceComponent } from './main/audio-in-device/audio-in-device.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PresetsComponent } from './main/presets/presets.component';
import { PresetGroupComponent } from './main/preset-group/preset-group.component';
import { PresetComponent } from './main/preset/preset.component';
import { DeviceDetailsComponent } from './device-details/device-details.component';
import { AirspyhfComponent } from './device-details/airspyhf/airspyhf.component';
import { DeviceNotSupportedComponent } from './device-details/device-not-supported/device-not-supported.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        InstanceSummaryComponent,
        DevicesetComponent,
        DeviceComponent,
        ChannelComponent,
        AudioOutComponent,
        AudioOutDeviceComponent,
        AudioInComponent,
        AudioInDeviceComponent,
        PresetsComponent,
        PresetGroupComponent,
        PresetComponent,
        DeviceDetailsComponent,
        AirspyhfComponent,
        DeviceNotSupportedComponent
      ],
      imports: [
        FormsModule,
        MatCardModule,
        MatDialogModule,
        MatOptionModule,
        MatSelectModule,
        MatCheckboxModule,
        MatSnackBarModule,
        MatTooltipModule,
        HttpClientTestingModule,
        AppRoutingModule
      ],
      providers: [{provide: APP_BASE_HREF, useValue: '/'}]
    }).compileComponents();
  }));
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'SDRangelCli'`, async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('SDRangelCli');
  }));
  // it('should render title in a h1 tag', async(() => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.debugElement.nativeElement;
  //   expect(compiled.querySelector('h1').textContent).toContain('Welcome to SDRangelCli!');
  // }));
});
