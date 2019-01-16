import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Bladerf1OutputComponent } from './bladerf1-output.component';

describe('Bladerf1OutputComponent', () => {
  let component: Bladerf1OutputComponent;
  let fixture: ComponentFixture<Bladerf1OutputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Bladerf1OutputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Bladerf1OutputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
