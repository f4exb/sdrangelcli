import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPresetDialogComponent } from './new-preset-dialog.component';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatOptionModule, MatSelectModule, MatSnackBarModule, MatDividerModule, MatDialogRef, MAT_DIALOG_DATA, MatCheckboxModule } from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('NewPresetDialogComponent', () => {
  let component: NewPresetDialogComponent;
  let fixture: ComponentFixture<NewPresetDialogComponent>;
  const data = {
    deviceSetIndex: 0,
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewPresetDialogComponent ],
      imports: [
        FormsModule,
        MatDialogModule,
        MatOptionModule,
        MatSelectModule,
        MatSnackBarModule,
        MatDividerModule,
        MatCheckboxModule,
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
    fixture = TestBed.createComponent(NewPresetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
