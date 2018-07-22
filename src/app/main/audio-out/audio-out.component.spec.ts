import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioOutComponent } from './audio-out.component';
import { MatCardModule } from '@angular/material';
import { AudioOutDeviceComponent } from '../audio-out-device/audio-out-device.component';
import { HttpClientModule } from '@angular/common/http';
import { AUDIO_DEVICES_MOCK } from '../audio/audio';

describe('AudioOutComponent', () => {
  let component: AudioOutComponent;
  let fixture: ComponentFixture<AudioOutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AudioOutComponent,
        AudioOutDeviceComponent
      ],
      imports: [
        MatCardModule,
        HttpClientModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioOutComponent);
    component = fixture.componentInstance;
    component.audioDevicesInfo = AUDIO_DEVICES_MOCK;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
