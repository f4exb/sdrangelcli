import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelNotSupportedComponent } from './channel-not-supported.component';
import { MatCardModule } from '@angular/material/card';

describe('ChannelNotSupportedComponent', () => {
  let component: ChannelNotSupportedComponent;
  let fixture: ComponentFixture<ChannelNotSupportedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelNotSupportedComponent ],
      imports: [ MatCardModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelNotSupportedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
