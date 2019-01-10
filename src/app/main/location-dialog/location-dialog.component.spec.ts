import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationDialogComponent } from './location-dialog.component';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBarModule, MatDividerModule } from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LocationDialogComponent', () => {
  let component: LocationDialogComponent;
  let fixture: ComponentFixture<LocationDialogComponent>;
  const data = {title: 'Test Location'};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationDialogComponent ],
      imports: [
        FormsModule,
        MatDialogModule,
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
    fixture = TestBed.createComponent(LocationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
