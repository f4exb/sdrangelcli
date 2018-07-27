import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportPresetDialogComponent } from './export-preset-dialog.component';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatOptionModule, MatSelectModule, MatSnackBarModule, MatDividerModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ExportPresetDialogComponent', () => {
  let component: ExportPresetDialogComponent;
  let fixture: ComponentFixture<ExportPresetDialogComponent>;
  const data = {
    preset: {
      groupName: "test",
      centerFrequency: 435000000,
      name: "test",
      type: "R"
    }
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportPresetDialogComponent ],
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
    fixture = TestBed.createComponent(ExportPresetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
