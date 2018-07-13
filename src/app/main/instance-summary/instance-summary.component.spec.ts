import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';

import { InstanceSummaryComponent } from './instance-summary.component';
import { InstanceSummaryService } from '../instance-summary.service';
import { INSTANCE_SUMMARY_MOCK } from './instance-summary';

describe('InstanceSummaryComponent', () => {
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
    spyOn(instanceSummaryService, 'getInfo').and.returnValue(of(INSTANCE_SUMMARY_MOCK));
    fixture = TestBed.createComponent(InstanceSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch data', () => {
    expect(component.instanceSummary.appname).toBe("SDRangel");
  });
  
});
