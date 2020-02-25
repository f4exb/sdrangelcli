import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeDeviceDialogComponent } from './change-device-dialog.component';
import { FormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ChangeDeviceDialogComponent', () => {
  let component: ChangeDeviceDialogComponent;
  let fixture: ComponentFixture<ChangeDeviceDialogComponent>;
  const data = {
    deviceSetIndex: 0,
    isTx: false
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeDeviceDialogComponent ],
      imports: [
        FormsModule,
        MatDialogModule,
        MatOptionModule,
        MatSelectModule,
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
    fixture = TestBed.createComponent(ChangeDeviceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
