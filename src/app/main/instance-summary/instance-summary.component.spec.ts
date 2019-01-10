import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { InstanceSummaryComponent } from './instance-summary.component';
import { InstanceSummaryService } from './instance-summary.service';
import { INSTANCE_SUMMARY_MOCK1, INSTANCE_SUMMARY_MOCK_EMPTY, INSTANCE_SUMMARY_MOCK_MANY } from './instance-summary';
import { MatCardModule } from '@angular/material/card';
import { DevicesetComponent } from '../../deviceset/deviceset/deviceset.component';
import { DeviceComponent } from '../../deviceset/device/device.component';
import { ChannelComponent } from '../../deviceset/channel/channel.component';
import { MatDialogModule, MatSnackBarModule, MatTooltipModule } from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';

describe('InstanceSummaryComponent one device set', () => {
  let component: InstanceSummaryComponent;
  let fixture: ComponentFixture<InstanceSummaryComponent>;
  let instanceSummaryService: InstanceSummaryService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        InstanceSummaryComponent,
        DevicesetComponent ,
        DeviceComponent,
        ChannelComponent
      ],
      imports: [
        HttpClientTestingModule,
        MatCardModule,
        MatDialogModule,
        MatSnackBarModule,
        MatTooltipModule
      ],
      providers: [
        InstanceSummaryService,
        {provide: Router, useValue: {}}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    instanceSummaryService = TestBed.get(InstanceSummaryService);
    spyOn(instanceSummaryService, 'getInfo').and.returnValue(of(INSTANCE_SUMMARY_MOCK1));
    fixture = TestBed.createComponent(InstanceSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch data', () => {
    expect(component.instanceSummary.appname).toBe('SDRangel');
  });

});

describe('InstanceSummaryComponent empty', () => {
  let component: InstanceSummaryComponent;
  let fixture: ComponentFixture<InstanceSummaryComponent>;
  let instanceSummaryService: InstanceSummaryService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        InstanceSummaryComponent,
        DevicesetComponent,
        DeviceComponent,
        ChannelComponent
      ],
      imports: [
        HttpClientTestingModule,
        MatCardModule,
        MatDialogModule,
        MatSnackBarModule,
        MatTooltipModule
      ],
      providers: [
        InstanceSummaryService,
        {provide: Router, useValue: {}}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    instanceSummaryService = TestBed.get(InstanceSummaryService);
    spyOn(instanceSummaryService, 'getInfo').and.returnValue(of(INSTANCE_SUMMARY_MOCK_EMPTY));
    fixture = TestBed.createComponent(InstanceSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch data', () => {
    expect(component.instanceSummary.appname).toBe('SDRangelSrv');
  });

});

describe('InstanceSummaryComponent many device sets', () => {
  let component: InstanceSummaryComponent;
  let fixture: ComponentFixture<InstanceSummaryComponent>;
  let instanceSummaryService: InstanceSummaryService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        InstanceSummaryComponent,
        DevicesetComponent,
        DeviceComponent,
        ChannelComponent
      ],
      imports: [
        HttpClientTestingModule,
        MatCardModule,
        MatDialogModule,
        MatSnackBarModule,
        MatTooltipModule
      ],
      providers: [
        InstanceSummaryService,
        {provide: Router, useValue: {}}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    instanceSummaryService = TestBed.get(InstanceSummaryService);
    spyOn(instanceSummaryService, 'getInfo').and.returnValue(of(INSTANCE_SUMMARY_MOCK_MANY));
    fixture = TestBed.createComponent(InstanceSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 3 device sets', () => {
    expect(component.instanceSummary.devicesetlist.devicesetcount).toBe(3);
    expect(component.instanceSummary.devicesetlist.deviceSets).toBeDefined();
    expect(component.instanceSummary.devicesetlist.deviceSets.slice(0)).toBeDefined();
    expect(component.instanceSummary.devicesetlist.deviceSets.slice(1)).toBeDefined();
    expect(component.instanceSummary.devicesetlist.deviceSets.slice(2)).toBeDefined();
  });

});
