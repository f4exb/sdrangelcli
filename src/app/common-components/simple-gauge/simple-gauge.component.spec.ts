import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SimpleGaugeComponent } from './simple-gauge.component';

describe('SimpleGaugeComponent', () => {
  let component: SimpleGaugeComponent;
  let fixture: ComponentFixture<SimpleGaugeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleGaugeComponent ],
      imports: [
        MatProgressBarModule,
        MatTooltipModule
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleGaugeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
