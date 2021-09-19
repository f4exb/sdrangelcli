import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FEATURE_PRESET_GROUP_MOCK } from '../featurepreset/featurepreset';
import { FeaturepresetComponent } from '../featurepreset/featurepreset.component';

import { FeaturepresetGroupComponent } from './featurepreset-group.component';

describe('FeaturepresetGroupComponent', () => {
  let component: FeaturepresetGroupComponent;
  let fixture: ComponentFixture<FeaturepresetGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        FeaturepresetGroupComponent,
        FeaturepresetComponent
      ],
      imports: [
        MatCardModule,
        MatDialogModule,
        MatSnackBarModule,
        MatTooltipModule,
        HttpClientTestingModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturepresetGroupComponent);
    component = fixture.componentInstance;
    component.presetGroup = FEATURE_PRESET_GROUP_MOCK;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
