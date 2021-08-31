import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveFeatureDialogComponent } from './remove-feature-dialog.component';
import { FormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FEATURE0_MOCK } from '../feature/feature';

describe('RemoveFeatureDialogComponent', () => {
  let component: RemoveFeatureDialogComponent;
  let fixture: ComponentFixture<RemoveFeatureDialogComponent>;
  const data = {
    featureSetIndex: 0,
    FEATURE: FEATURE0_MOCK
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoveFeatureDialogComponent ],
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
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveFeatureDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
