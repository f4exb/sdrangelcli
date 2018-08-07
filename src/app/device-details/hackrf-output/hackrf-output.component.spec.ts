import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HackrfOutputComponent } from './hackrf-output.component';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatTooltipModule } from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('HackrfOutputComponent', () => {
  let component: HackrfOutputComponent;
  let fixture: ComponentFixture<HackrfOutputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HackrfOutputComponent ],
      imports: [
        RouterModule,
        FormsModule,
        MatCardModule,
        MatSelectModule,
        MatOptionModule,
        MatCheckboxModule,
        MatTooltipModule,
        HttpClientTestingModule
      ],
      providers: [
        {provide: ActivatedRoute, useValue: { snapshot: {parent: {params: {dix: 0}}}}}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HackrfOutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
