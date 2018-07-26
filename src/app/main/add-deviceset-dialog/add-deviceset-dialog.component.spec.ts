import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDevicesetDialogComponent } from './add-deviceset-dialog.component';
import { MatDialogModule, MatSnackBarModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AddDevicesetDialogComponent', () => {
  let component: AddDevicesetDialogComponent;
  let fixture: ComponentFixture<AddDevicesetDialogComponent>;
  const data = {isTx: false};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDevicesetDialogComponent ],
      imports: [
        MatDialogModule,
        MatSnackBarModule,
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
    fixture = TestBed.createComponent(AddDevicesetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
