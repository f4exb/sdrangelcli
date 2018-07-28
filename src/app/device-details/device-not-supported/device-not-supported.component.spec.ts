import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceNotSupportedComponent } from './device-not-supported.component';

describe('DeviceNotSupportedComponent', () => {
  let component: DeviceNotSupportedComponent;
  let fixture: ComponentFixture<DeviceNotSupportedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceNotSupportedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceNotSupportedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
