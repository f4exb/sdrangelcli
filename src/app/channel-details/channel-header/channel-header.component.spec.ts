import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelHeaderComponent } from './channel-header.component';
import { ColorPickerModule } from 'ngx-color-picker';
import { FormsModule } from '@angular/forms';

describe('ChannelHeaderComponent', () => {
  let component: ChannelHeaderComponent;
  let fixture: ComponentFixture<ChannelHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChannelHeaderComponent ],
      imports: [
        FormsModule,
        ColorPickerModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelHeaderComponent);
    component = fixture.componentInstance;
    component.channelType = "AMDemod";
    component.basebandRate = 96000;
    component.colorStr = "rgb(255,255,0)";
    component.title = "Test AM demod";
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
