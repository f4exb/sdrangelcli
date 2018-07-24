import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioInDialogComponent } from './audio-in-dialog.component';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatOptionModule, MatSelectModule, MatCheckboxModule, MatSnackBarModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { AUDIO_IN_DEVICE_MOCK } from '../audio/audio';

describe('AudioInDialogComponent', () => {
  let component: AudioInDialogComponent;
  let fixture: ComponentFixture<AudioInDialogComponent>;
  const data = {
    audioDevice: AUDIO_IN_DEVICE_MOCK
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AudioInDialogComponent ],
      imports: [
        FormsModule,
        MatDialogModule,
        MatOptionModule,
        MatSelectModule,
        MatCheckboxModule,
        MatSnackBarModule,
        HttpClientModule
      ],
      providers: [
        { provide: MatDialogRef, useValue : {} },
        { provide: MAT_DIALOG_DATA, useValue: data }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioInDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
