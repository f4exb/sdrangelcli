import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerseusComponent } from './perseus.component';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatTooltipModule } from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonComponentsModule } from '../../common-components/common-components.module';

describe('PerseusComponent', () => {
  let component: PerseusComponent;
  let fixture: ComponentFixture<PerseusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerseusComponent ],
      imports: [
        RouterModule,
        FormsModule,
        MatCardModule,
        MatSelectModule,
        MatOptionModule,
        MatCheckboxModule,
        MatTooltipModule,
        HttpClientTestingModule,
        CommonComponentsModule
      ],
      providers: [
        {provide: ActivatedRoute, useValue: { snapshot: {parent: {params: {dix: 0}}}}}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerseusComponent);
    component = fixture.componentInstance;
    component.sampleRates = [
      {value: 0, viewValue: 48000}
    ]
    component.settings.devSampleRateIndex = 0;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
