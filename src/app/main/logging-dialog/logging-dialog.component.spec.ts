import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggingDialogComponent } from './logging-dialog.component';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatOptionModule, MatSelectModule, MatDialogRef, MAT_DIALOG_DATA, MatCheckboxModule, MatSnackBarModule, MatDividerModule } from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LoggingDialogComponent', () => {
  let component: LoggingDialogComponent;
  let fixture: ComponentFixture<LoggingDialogComponent>;
  const data = {title: "Test Logging"};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoggingDialogComponent ],
      imports: [
        FormsModule,
        MatDialogModule,
        MatOptionModule,
        MatSelectModule,
        MatCheckboxModule,
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
    fixture = TestBed.createComponent(LoggingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
