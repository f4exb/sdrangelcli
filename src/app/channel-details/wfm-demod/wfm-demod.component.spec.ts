import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WfmDemodComponent } from './wfm-demod.component';
import { ChannelHeaderComponent } from '../channel-header/channel-header.component';
import { ChannelMonitorComponent } from '../channel-monitor/channel-monitor.component';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatTooltipModule, MatProgressBarModule } from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonComponentsModule } from '../../common-components/common-components.module';
import { ColorPickerModule } from 'ngx-color-picker';

describe('WfmDemodComponent', () => {
  let component: WfmDemodComponent;
  let fixture: ComponentFixture<WfmDemodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        WfmDemodComponent,
        ChannelHeaderComponent,
        ChannelMonitorComponent
      ],
      imports: [
        RouterModule,
        FormsModule,
        MatCardModule,
        MatSelectModule,
        MatOptionModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatProgressBarModule,
        HttpClientTestingModule,
        CommonComponentsModule,
        ColorPickerModule
      ],
      providers: [
        {provide: ActivatedRoute, useValue: { snapshot: {parent: {params: {dix: 0, cix: 0}}}}}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WfmDemodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
