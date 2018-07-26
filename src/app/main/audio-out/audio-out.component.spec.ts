import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioOutComponent } from './audio-out.component';
import { MatCardModule, MatDialogModule } from '@angular/material';
import { AudioOutDeviceComponent } from '../audio-out-device/audio-out-device.component';
import { AUDIO_DEVICES_MOCK } from '../audio/audio';
import { HttpClientTestingModule } from '@angular/common/http/testing';

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
        MatDialogModule,
        HttpClientTestingModule
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
