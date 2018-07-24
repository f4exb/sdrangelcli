import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioInDeviceComponent } from './audio-in-device.component';
import { MatCardModule, MatDialogModule } from '@angular/material';
import { AUDIO_IN_DEVICE_MOCK } from '../audio/audio';

describe('AudioInDeviceComponent', () => {
  let component: AudioInDeviceComponent;
  let fixture: ComponentFixture<AudioInDeviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AudioInDeviceComponent ],
      imports: [
        MatCardModule,
        MatDialogModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioInDeviceComponent);
    component = fixture.componentInstance;
    component.audioDevice = AUDIO_IN_DEVICE_MOCK;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
