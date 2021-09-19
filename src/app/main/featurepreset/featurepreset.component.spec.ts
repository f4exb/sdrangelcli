import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { FEATURE_PRESET_MOCK } from './featurepreset';

import { FeaturepresetComponent } from './featurepreset.component';

describe('FeaturepresetComponent', () => {
  let component: FeaturepresetComponent;
  let fixture: ComponentFixture<FeaturepresetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeaturepresetComponent ],
      imports: [
        MatCardModule,
        MatDialogModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturepresetComponent);
    component = fixture.componentInstance;
    component.preset = FEATURE_PRESET_MOCK;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
