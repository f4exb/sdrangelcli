import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmDemodComponent } from './am-demod.component';

describe('AmDemodComponent', () => {
  let component: AmDemodComponent;
  let fixture: ComponentFixture<AmDemodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmDemodComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmDemodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
