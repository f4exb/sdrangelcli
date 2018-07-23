import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioInComponent } from './audio-in.component';
import { AudioInDeviceComponent } from '../audio-in-device/audio-in-device.component';
import { MatCardModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { AUDIO_DEVICES_MOCK } from '../audio/audio';

describe('AudioInComponent', () => {
  let component: AudioInComponent;
  let fixture: ComponentFixture<AudioInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AudioInComponent,
        AudioInDeviceComponent
      ],
      imports: [
        MatCardModule,
        HttpClientModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioInComponent);
    component = fixture.componentInstance;
    component.audioDevicesInfo = AUDIO_DEVICES_MOCK;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
