import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KiwisdrComponent } from './kiwisdr.component';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatTooltipModule } from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonComponentsModule } from 'src/app/common-components/common-components.module';

describe('KiwisdrComponent', () => {
  let component: KiwisdrComponent;
  let fixture: ComponentFixture<KiwisdrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KiwisdrComponent ],
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
    fixture = TestBed.createComponent(KiwisdrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
