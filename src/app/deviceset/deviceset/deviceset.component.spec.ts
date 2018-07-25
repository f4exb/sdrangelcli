import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicesetComponent } from './deviceset.component';
import { MatCardModule } from '@angular/material/card';
import { DEVICESET_MOCK_WITH_CHANNELS, DEVICESET_MOCK_WITHOUT_CHANNELS, DEVICESET_TX_MOCK } from './deviceset';
import { DeviceComponent } from '../device/device.component';
import { ChannelComponent } from '../channel/channel.component';
import { MatDialogModule, MatSnackBarModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';

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
        MatCardModule,
        MatDialogModule,
        MatSnackBarModule,
        HttpClientModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicesetComponent);
    component = fixture.componentInstance;
    component.deviceSet = DEVICESET_MOCK_WITHOUT_CHANNELS;
    component.deviceSet.samplingDevice.index = 0;
    fixture.detectChanges();
  });

  it('should create deviceset', () => {
    expect(component).toBeTruthy();
    expect(component.deviceSet.channels).toBeUndefined();
  });

  it('should not have any channel', () => {
    expect(component.deviceSet.channelcount).toBe(0);
    expect(component.deviceSet.channels).toBeUndefined();
  });

  it('label should be Rx0', () => {
    expect(component.getLabel()).toBe("Rx0");
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
        MatCardModule,
        MatDialogModule,
        MatSnackBarModule,
        HttpClientModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicesetComponent);
    component = fixture.componentInstance;
    component.deviceSet = DEVICESET_MOCK_WITH_CHANNELS;
    component.deviceSet.samplingDevice.index = 0;
    fixture.detectChanges();
  });

  it('should create deviceset', () => {
    expect(component).toBeTruthy();
  });

  it('should have 2 channels', () => {
    expect(component.deviceSet.channelcount).toBe(2);
    expect(component.deviceSet.channels).toBeDefined();
    expect(component.deviceSet.channels[0]).toBeDefined();
    expect(component.deviceSet.channels[1]).toBeDefined();
  });
});

describe('DevicesetComponent with Tx device', () => {
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
        MatCardModule,
        MatDialogModule,
        MatSnackBarModule,
        HttpClientModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DevicesetComponent);
    component = fixture.componentInstance;
    component.deviceSet = DEVICESET_TX_MOCK;
    fixture.detectChanges();
  });

  it('should create deviceset', () => {
    expect(component).toBeTruthy();
  });

  it('label should be Tx2', () => {
    expect(component.getLabel()).toBe("Tx2");
  });
});
