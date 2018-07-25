import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeDeviceDialogComponent } from './change-device-dialog.component';

describe('ChangeDeviceDialogComponent', () => {
  let component: ChangeDeviceDialogComponent;
  let fixture: ComponentFixture<ChangeDeviceDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangeDeviceDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeDeviceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
