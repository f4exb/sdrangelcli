import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlutosdrOutputComponent } from './plutosdr-output.component';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatTooltipModule } from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonComponentsModule } from '../../common-components/common-components.module';

describe('PlutosdrOutputComponent', () => {
  let component: PlutosdrOutputComponent;
  let fixture: ComponentFixture<PlutosdrOutputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlutosdrOutputComponent ],
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
    fixture = TestBed.createComponent(PlutosdrOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
