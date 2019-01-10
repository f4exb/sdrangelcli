import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChannelDialogComponent } from './add-channel-dialog.component';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatOptionModule, MatSelectModule, MatSnackBarModule, MatDividerModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AddChannelDialogComponent', () => {
  let component: AddChannelDialogComponent;
  let fixture: ComponentFixture<AddChannelDialogComponent>;
  const data = {
    deviceSetIndex: 0,
    isTx: false
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddChannelDialogComponent ],
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
    fixture = TestBed.createComponent(AddChannelDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
