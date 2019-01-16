import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Bladerf2OutputComponent } from './bladerf2-output.component';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatTooltipModule } from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonComponentsModule } from '../../common-components/common-components.module';

describe('Bladerf2OutputComponent', () => {
  let component: Bladerf2OutputComponent;
  let fixture: ComponentFixture<Bladerf2OutputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        Bladerf2OutputComponent
      ],
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
    fixture = TestBed.createComponent(Bladerf2OutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
