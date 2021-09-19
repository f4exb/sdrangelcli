import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveFeaturesetDialogComponent } from './remove-featureset-dialog.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RemoveFeaturesetDialogComponent', () => {
  let component: RemoveFeaturesetDialogComponent;
  let fixture: ComponentFixture<RemoveFeaturesetDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RemoveFeaturesetDialogComponent ],
      imports: [
        MatDialogModule,
        MatSnackBarModule,
        HttpClientTestingModule
      ],
      providers: [ { provide: MatDialogRef, useValue : {} } ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveFeaturesetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
