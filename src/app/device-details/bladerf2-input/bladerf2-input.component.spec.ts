import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Bladerf2InputComponent } from './bladerf2-input.component';

describe('Bladerf2InputComponent', () => {
  let component: Bladerf2InputComponent;
  let fixture: ComponentFixture<Bladerf2InputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Bladerf2InputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Bladerf2InputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
