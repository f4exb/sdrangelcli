import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FreedvModComponent } from './freedv-mod.component';
import { ChannelHeaderComponent } from '../channel-header/channel-header.component';
import { ChannelMonitorComponent } from '../channel-monitor/channel-monitor.component';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule, MatSelectModule, MatOptionModule, MatCheckboxModule, MatTooltipModule, MatProgressBarModule } from '@angular/material';
import { CommonComponentsModule } from 'src/app/common-components/common-components.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ColorPickerModule } from 'ngx-color-picker';

describe('FreedvModComponent', () => {
  let component: FreedvModComponent;
  let fixture: ComponentFixture<FreedvModComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
          FreedvModComponent,
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
    fixture = TestBed.createComponent(FreedvModComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
