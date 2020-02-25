import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioOutDialogComponent } from './audio-out-dialog.component';
import { AUDIO_OUT_DEVICE_MOCK } from '../audio/audio';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AudioOutDialogComponent', () => {
  let component: AudioOutDialogComponent;
  let fixture: ComponentFixture<AudioOutDialogComponent>;
  const data = {
    audioDevice: AUDIO_OUT_DEVICE_MOCK
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AudioOutDialogComponent ],
      imports: [
        FormsModule,
        MatDialogModule,
        MatOptionModule,
        MatSelectModule,
        MatCheckboxModule,
        MatSnackBarModule,
        MatDividerModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: MatDialogRef, useValue : {} },
        { provide: MAT_DIALOG_DATA, useValue: data }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioOutDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
