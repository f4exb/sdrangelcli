import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavePresetDialogComponent } from './save-preset-dialog.component';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatOptionModule, MatSelectModule, MatSnackBarModule, MatDividerModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';

describe('SavePresetDialogComponent', () => {
  let component: SavePresetDialogComponent;
  let fixture: ComponentFixture<SavePresetDialogComponent>;
  const data = {
    deviceSetIndex: 0,
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavePresetDialogComponent ],
      imports: [
        FormsModule,
        MatDialogModule,
        MatOptionModule,
        MatSelectModule,
        MatSnackBarModule,
        MatDividerModule,
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
    fixture = TestBed.createComponent(SavePresetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
