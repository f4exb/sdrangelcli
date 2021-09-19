import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FEATURE_PRESET_MOCK } from '../featurepreset/featurepreset';

import { RemoveFeaturePresetDialogComponent } from './remove-feature-preset-dialog.component';

describe('RemoveFeaturePresetDialogComponent', () => {
  let component: RemoveFeaturePresetDialogComponent;
  let fixture: ComponentFixture<RemoveFeaturePresetDialogComponent>;
  const data = {
    groupName: 'test',
    preset: FEATURE_PRESET_MOCK
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoveFeaturePresetDialogComponent ],
      imports: [
        FormsModule,
        MatDialogModule,
        MatDividerModule,
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
    fixture = TestBed.createComponent(RemoveFeaturePresetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
