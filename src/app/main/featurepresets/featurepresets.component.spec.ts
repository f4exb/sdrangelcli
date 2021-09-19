import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { FeaturepresetGroupComponent } from '../featurepreset-group/featurepreset-group.component';
import { FEATURE_PRESETS_MOCK } from '../featurepreset/featurepreset';
import { FeaturepresetComponent } from '../featurepreset/featurepreset.component';

import { FeaturepresetsComponent } from './featurepresets.component';

describe('FeaturepresetsComponent', () => {
  let component: FeaturepresetsComponent;
  let fixture: ComponentFixture<FeaturepresetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        FeaturepresetsComponent,
        FeaturepresetGroupComponent,
        FeaturepresetComponent
      ],
      imports: [
        MatCardModule,
        MatDialogModule,
        HttpClientTestingModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturepresetsComponent);
    component = fixture.componentInstance;
    component.presets = FEATURE_PRESETS_MOCK;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
