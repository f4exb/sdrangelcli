import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelMonitorComponent } from './channel-monitor.component';
import { MatProgressBarModule, MatTooltipModule } from '@angular/material';

describe('ChannelMonitorComponent', () => {
  let component: ChannelMonitorComponent;
  let fixture: ComponentFixture<ChannelMonitorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelMonitorComponent ],
      imports: [
        MatProgressBarModule,
        MatTooltipModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelMonitorComponent);
    component = fixture.componentInstance;
    component.value = -50;
    component.min = -120;
    component.max = 0;
    component.squelch = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
