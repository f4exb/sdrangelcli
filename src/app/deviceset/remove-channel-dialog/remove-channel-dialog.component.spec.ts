import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveChannelDialogComponent } from './remove-channel-dialog.component';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatOptionModule, MatSelectModule, MatSnackBarModule, MatDividerModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CHANNEL1_MOCK } from '../channel/channel';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RemoveChannelDialogComponent', () => {
  let component: RemoveChannelDialogComponent;
  let fixture: ComponentFixture<RemoveChannelDialogComponent>;
  const data = {
    deviceSetIndex: 0,
    centerFrequency: 0,
    channel: CHANNEL1_MOCK
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveChannelDialogComponent ],
      imports: [
        FormsModule,
        MatDialogModule,
        MatOptionModule,
        MatSelectModule,
        MatSnackBarModule,
        MatDividerModule,
        HttpClientTestingModule
      ],
      providers: [
        { provide: MatDialogRef, useValue : {} },
        { provide: MAT_DIALOG_DATA, useValue: data }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveChannelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
