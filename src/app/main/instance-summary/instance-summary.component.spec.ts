import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstanceSummaryComponent } from './instance-summary.component';
import { InstanceSummaryService } from '../instance-summary.service';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';

const INSTANCE_SUMMARY = {
  appname: "SDRangel",
  architecture: "x86_64",
  devicesetlist: {
    deviceSets: [
      {
        channelcount: 0,
        samplingDevice: {
          bandwidth: 0,
          centerFrequency: 0,
          hwType: "FileSource",
          index: 0,
          nbStreams: 1,
          sequence: 0,
          state: "idle",
          streamIndex: 0,
          tx: 0
        }
      }
    ],
    devicesetcount: 1,
    devicesetfocus: 0
  },
  dspRxBits: 24,
  dspTxBits: 16,
  logging: {
    consoleLevel: "debug",
    dumpToFile: 0
  },
  os: "Ubuntu 18.04 LTS",
  pid: 8958,
  qtVersion: "5.9.5",
  version: "4.0.3"
};

describe('InfoComponent', () => {
  let component: InstanceSummaryComponent;
  let fixture: ComponentFixture<InstanceSummaryComponent>;
  let instanceSummaryService: InstanceSummaryService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstanceSummaryComponent ],
      imports: [ HttpClientModule ],
      providers: [ InstanceSummaryService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    instanceSummaryService = TestBed.get(InstanceSummaryService);
    spyOn(instanceSummaryService, 'getInfo').and.returnValue(of(INSTANCE_SUMMARY));
    fixture = TestBed.createComponent(InstanceSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
