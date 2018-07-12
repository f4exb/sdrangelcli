import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicesetComponent } from './deviceset.component';

describe('DevicesetComponent', () => {
  let component: DevicesetComponent;
  let fixture: ComponentFixture<DevicesetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DevicesetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicesetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
