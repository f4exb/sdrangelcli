import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BfmDemodComponent } from './bfm-demod.component';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CommonComponentsModule } from '../../common-components/common-components.module';
import { ColorPickerModule } from 'ngx-color-picker';
import { ChannelHeaderComponent } from '../channel-header/channel-header.component';
import { ChannelMonitorComponent } from '../channel-monitor/channel-monitor.component';

describe('BfmDemodComponent', () => {
  let component: BfmDemodComponent;
  let fixture: ComponentFixture<BfmDemodComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BfmDemodComponent,
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
    fixture = TestBed.createComponent(BfmDemodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
