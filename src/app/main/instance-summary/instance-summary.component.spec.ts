import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstanceSummaryComponent } from './instance-summary.component';

describe('InfoComponent', () => {
  let component: InstanceSummaryComponent;
  let fixture: ComponentFixture<InstanceSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstanceSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstanceSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
