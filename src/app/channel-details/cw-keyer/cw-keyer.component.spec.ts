import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CwKeyerComponent } from './cw-keyer.component';
import { FormsModule } from '@angular/forms';
import { MatSelectModule, MatCheckboxModule, MatOptionModule } from '@angular/material';

describe('CwKeyerComponent', () => {
  let component: CwKeyerComponent;
  let fixture: ComponentFixture<CwKeyerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CwKeyerComponent ],
      imports: [
        FormsModule,
        MatSelectModule,
        MatOptionModule,
        MatCheckboxModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CwKeyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
