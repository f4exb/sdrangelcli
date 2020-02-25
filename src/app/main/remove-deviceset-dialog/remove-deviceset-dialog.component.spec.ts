import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveDevicesetDialogComponent } from './remove-deviceset-dialog.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RemoveDevicesetDialogComponent', () => {
  let component: RemoveDevicesetDialogComponent;
  let fixture: ComponentFixture<RemoveDevicesetDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveDevicesetDialogComponent ],
      imports: [
        MatDialogModule,
        MatSnackBarModule,
        HttpClientTestingModule
      ],
      providers: [ { provide: MatDialogRef, useValue : {} } ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveDevicesetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
