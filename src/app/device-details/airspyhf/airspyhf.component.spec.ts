import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AirspyhfComponent } from './airspyhf.component';

describe('AirspyhfComponent', () => {
  let component: AirspyhfComponent;
  let fixture: ComponentFixture<AirspyhfComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AirspyhfComponent ]
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
