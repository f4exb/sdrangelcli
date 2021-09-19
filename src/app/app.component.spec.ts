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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AudioOutComponent } from './main/audio-out/audio-out.component';
import { AudioOutDeviceComponent } from './main/audio-out-device/audio-out-device.component';
import { AudioInComponent } from './main/audio-in/audio-in.component';
import { AudioInDeviceComponent } from './main/audio-in-device/audio-in-device.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PresetsComponent } from './main/presets/presets.component';
import { PresetGroupComponent } from './main/preset-group/preset-group.component';
import { PresetComponent } from './main/preset/preset.component';
import { DeviceDetailsComponent } from './device-details/device-details.component';
import { DeviceNotSupportedComponent } from './device-details/device-not-supported/device-not-supported.component';
import { CommonComponentsModule } from './common-components/common-components.module';
import { FeaturesetComponent } from './featureset/featureset/featureset.component';
import { FeatureComponent } from './featureset/feature/feature.component';
import { FeaturepresetsComponent } from './main/featurepresets/featurepresets.component';
import { FeaturepresetGroupComponent } from './main/featurepreset-group/featurepreset-group.component';
import { FeaturepresetComponent } from './main/featurepreset/featurepreset.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        InstanceSummaryComponent,
        DevicesetComponent,
        DeviceComponent,
        ChannelComponent,
        FeaturesetComponent,
        FeatureComponent,
        AudioOutComponent,
        AudioOutDeviceComponent,
        AudioInComponent,
        AudioInDeviceComponent,
        PresetsComponent,
        PresetGroupComponent,
        PresetComponent,
        FeaturepresetsComponent,
        FeaturepresetGroupComponent,
        FeaturepresetComponent,
        DeviceDetailsComponent,
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
        AppRoutingModule,
        CommonComponentsModule
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
