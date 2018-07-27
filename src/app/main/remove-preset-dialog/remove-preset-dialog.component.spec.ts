import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemovePresetDialogComponent } from './remove-preset-dialog.component';
import { PRESET_MOCK } from '../preset/preset';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatOptionModule, MatSelectModule, MatSnackBarModule, MatDividerModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RemovePresetDialogComponent', () => {
  let component: RemovePresetDialogComponent;
  let fixture: ComponentFixture<RemovePresetDialogComponent>;
  const data = {
    groupName: "test",
    preset: PRESET_MOCK
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemovePresetDialogComponent ],
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
    fixture = TestBed.createComponent(RemovePresetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
