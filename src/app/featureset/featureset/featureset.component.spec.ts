import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeatureComponent } from '../feature/feature.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { FeaturesetComponent } from './featureset.component';
import { MatCardModule } from '@angular/material/card';
import { FEATURESET_MOCK_WITHOUT_FEATURES } from './featureset';

describe('FeaturesetComponent without features', () => {
  let component: FeaturesetComponent;
  let fixture: ComponentFixture<FeaturesetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        FeaturesetComponent,
        FeatureComponent
      ],
      imports: [
        MatCardModule,
        MatDialogModule,
        MatSnackBarModule,
        MatTooltipModule,
        HttpClientTestingModule
      ],
      providers: [
        {provide: Router, useValue: {}}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeaturesetComponent);
    component = fixture.componentInstance;
    component.featureSet = FEATURESET_MOCK_WITHOUT_FEATURES;
    fixture.detectChanges();
  });

  it('should create featureset', () => {
    expect(component).toBeTruthy();
  });

  it('should not have any feature', () => {
    expect(component.featureSet.featurecount).toBe(0);
    expect(component.featureSet.features).toBeUndefined();
  });

  it('label should be F0', () => {
    expect(component.getLabel()).toBe('F0');
  });
});
