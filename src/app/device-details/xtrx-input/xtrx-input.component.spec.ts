import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XtrxInputComponent } from './xtrx-input.component';

describe('XtrxInputComponent', () => {
  let component: XtrxInputComponent;
  let fixture: ComponentFixture<XtrxInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XtrxInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XtrxInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
