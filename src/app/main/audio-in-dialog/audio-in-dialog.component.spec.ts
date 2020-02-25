import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioInDialogComponent } from './audio-in-dialog.component';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AUDIO_IN_DEVICE_MOCK } from '../audio/audio';
import { HttpClientTestingModule } from '@angular/common/http/testing';

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
    fixture = TestBed.createComponent(AudioInDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
