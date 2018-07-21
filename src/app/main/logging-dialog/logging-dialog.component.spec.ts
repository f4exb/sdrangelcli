import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggingDialogComponent } from './logging-dialog.component';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatOptionModule, MatSelectModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';

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
        HttpClientModule
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
