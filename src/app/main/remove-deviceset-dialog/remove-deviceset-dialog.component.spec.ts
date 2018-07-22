import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveDevicesetDialogComponent } from './remove-deviceset-dialog.component';
import { MatDialogModule, MatDialogRef, MatSnackBarModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';

describe('RemoveDevicesetDialogComponent', () => {
  let component: RemoveDevicesetDialogComponent;
  let fixture: ComponentFixture<RemoveDevicesetDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveDevicesetDialogComponent ],
      imports: [
        MatDialogModule,
        MatSnackBarModule,
        HttpClientModule
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
