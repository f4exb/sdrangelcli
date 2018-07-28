import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirspyhfComponent } from './airspyhf.component';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AirspyhfComponent', () => {
  let component: AirspyhfComponent;
  let fixture: ComponentFixture<AirspyhfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AirspyhfComponent,
      ],
      imports: [
        RouterModule,
        HttpClientTestingModule
      ],
      providers: [
        {provide: ActivatedRoute, useValue: { snapshot: {parent: {params: {dix: 0}}}}}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AirspyhfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});