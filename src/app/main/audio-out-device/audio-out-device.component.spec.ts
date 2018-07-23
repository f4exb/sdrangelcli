import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioOutDeviceComponent } from './audio-out-device.component';
import { MatCardModule, MatDialogModule } from '@angular/material';
import { AUDIO_OUT_DEVICE_MOCK } from '../audio/audio';

describe('AudioOutDeviceComponent', () => {
  let component: AudioOutDeviceComponent;
  let fixture: ComponentFixture<AudioOutDeviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AudioOutDeviceComponent ],
      imports: [
        MatCardModule,
        MatDialogModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioOutDeviceComponent);
    component = fixture.componentInstance;
    component.audioDevice = AUDIO_OUT_DEVICE_MOCK;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
