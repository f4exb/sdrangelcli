import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportPresetDialogComponent } from './import-preset-dialog.component';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatOptionModule, MatSelectModule, MatSnackBarModule, MatDividerModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ImportPresetDialogComponent', () => {
  let component: ImportPresetDialogComponent;
  let fixture: ComponentFixture<ImportPresetDialogComponent>;
  const data = {
    groupName: 'test'
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportPresetDialogComponent ],
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
    fixture = TestBed.createComponent(ImportPresetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
