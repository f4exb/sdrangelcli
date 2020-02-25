import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BufferGaugeComponent } from './buffer-gauge.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

describe('BufferGaugeComponent', () => {
  let component: BufferGaugeComponent;
  let fixture: ComponentFixture<BufferGaugeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BufferGaugeComponent ],
      imports: [
        MatProgressBarModule,
        MatTooltipModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BufferGaugeComponent);
    component = fixture.componentInstance;
    component.value = -30;
    component.min = -50;
    component.max = 50;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
