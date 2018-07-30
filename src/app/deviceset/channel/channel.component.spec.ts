import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';

import { ChannelComponent } from './channel.component';
import { CHANNEL0_MOCK } from './channel';
import { MatDialogModule } from '@angular/material';
import { RouterModule, Router } from '@angular/router';

describe('ChannelComponent', () => {
  let component: ChannelComponent;
  let fixture: ComponentFixture<ChannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelComponent ],
      imports: [
        MatCardModule,
        MatDialogModule,
        RouterModule
      ],
      providers: [
        {provide: Router, useValue: {}}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelComponent);
    component = fixture.componentInstance;
    component.channel = CHANNEL0_MOCK;
    component.centerFrequency = 435000000;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain data', () => {
    expect(component.channel.deltaFrequency).toBe(-26100);
    expect(component.channel.id).toBe("SSBDemod");
  });
});
