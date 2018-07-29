import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceComponent } from './device.component';
import { MatCardModule } from '@angular/material/card';

import { DEVICE_MOCK1 } from'./device';
import { MatDialogModule, MatTooltipModule, MatSnackBarModule } from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterModule, Router } from '@angular/router';

describe('DeviceComponent', () => {
  let component: DeviceComponent;
  let fixture: ComponentFixture<DeviceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeviceComponent ],
      imports: [
        MatCardModule,
        MatDialogModule,
        MatTooltipModule,
        MatSnackBarModule,
        HttpClientTestingModule,
        RouterModule
      ],
      providers: [
        {provide: Router, useValue: {}}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeviceComponent);
    component = fixture.componentInstance;
    component.device = DEVICE_MOCK1;
    component.device.index = 0;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
