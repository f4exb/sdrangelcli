import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ColorPickerModule } from 'ngx-color-picker';
import { CommonComponentsModule } from 'src/app/common-components/common-components.module';
import { FeatureHeaderComponent } from '../feature-header/feature-header.component';

import { SatelliteTrackerComponent } from './satellite-tracker.component';

describe('SatelliteTrackerComponent', () => {
  let component: SatelliteTrackerComponent;
  let fixture: ComponentFixture<SatelliteTrackerComponent>;
  const data = {title: 'Test Location'};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        SatelliteTrackerComponent,
        FeatureHeaderComponent
      ],
      imports: [
        RouterModule,
        FormsModule,
        MatDialogModule,
        BrowserAnimationsModule,
        MatCardModule,
        MatSelectModule,
        MatOptionModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatProgressBarModule,
        MatChipsModule,
        HttpClientTestingModule,
        CommonComponentsModule,
        ColorPickerModule
      ],
      providers: [
        { provide: MatDialogRef, useValue : {} },
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: ActivatedRoute, useValue: { snapshot: {parent: {params: {dix: 0, cix: 0}}}} }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SatelliteTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
