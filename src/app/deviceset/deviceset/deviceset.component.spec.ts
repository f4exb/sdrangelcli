import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicesetComponent } from './deviceset.component';
import { MatCardModule } from '@angular/material/card';
import { DEVICESET_MOCK_WITH_CHANNELS, DEVICESET_MOCK_WITHOUT_CHANNELS } from './deviceset';
import { DeviceComponent } from '../device/device.component';
import { ChannelComponent } from '../channel/channel.component';

describe('DevicesetComponent without channels', () => {
  let component: DevicesetComponent;
  let fixture: ComponentFixture<DevicesetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        DevicesetComponent,
        DeviceComponent,
        ChannelComponent
      ],
      imports: [
        MatCardModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicesetComponent);
    component = fixture.componentInstance;
    component.deviceSet = DEVICESET_MOCK_WITHOUT_CHANNELS;
    component.label = "R0";
    fixture.detectChanges();
  });

  it('should create deviceset', () => {
    expect(component).toBeTruthy();
    expect(component.deviceSet.channels).toBeUndefined();
  });
});

describe('DevicesetComponent with channels', () => {
  let component: DevicesetComponent;
  let fixture: ComponentFixture<DevicesetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ 
        DevicesetComponent,
        DeviceComponent,
        ChannelComponent
      ],
      imports: [
        MatCardModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicesetComponent);
    component = fixture.componentInstance;
    component.deviceSet = DEVICESET_MOCK_WITH_CHANNELS;
    component.label = "R0";
    fixture.detectChanges();
  });
  
  it('should create deviceset', () => {
    expect(component).toBeTruthy();
    expect(component.deviceSet.channels).toBeDefined();
    expect(component.deviceSet.channels[0]).toBeDefined();
    expect(component.deviceSet.channels[1]).toBeDefined();
  });
});
