import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFeatureDialogComponent } from './add-feature-dialog.component';

describe('AddFeatureDialogComponent', () => {
  let component: AddFeatureDialogComponent;
  let fixture: ComponentFixture<AddFeatureDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFeatureDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFeatureDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
