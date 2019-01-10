import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

export interface FrequencyStep {
  value: number;
  viewValue: number;
}

export const FREQUENCY_STEP_CHANNEL_DEFAULTS = [
  {value: 0.1, viewValue: 0.1},
  {value: 0.5, viewValue: 0.5},
  {value: 1, viewValue: 1},
  {value: 5, viewValue: 5},
  {value: 6.25, viewValue: 6.25},
  {value: 25 / 3, viewValue: 8.33},
  {value: 10, viewValue: 10},
  {value: 12.5, viewValue: 12.5},
  {value: 25, viewValue: 25},
  {value: 100, viewValue: 100},
];


export const FREQUENCY_STEP_DEVICE_DEFAULTS = [
  {value: 1, viewValue: 1},
  {value: 2, viewValue: 2},
  {value: 5, viewValue: 5},
  {value: 10, viewValue: 10},
  {value: 20, viewValue: 20},
  {value: 50, viewValue: 50},
  {value: 100, viewValue: 100},
  {value: 200, viewValue: 200},
  {value: 500, viewValue: 500},
  {value: 1000, viewValue: 1000},
  {value: 2000, viewValue: 2000},
  {value: 5000, viewValue: 5000},
];

@Component({
  selector: 'app-frequency-dial',
  templateUrl: './frequency-dial.component.html',
  styleUrls: ['./frequency-dial.component.css']
})
export class FrequencyDialComponent implements OnInit {
  @Input('frequency') frequency: number;
  @Input('min') min: number;
  @Input('max') max: number;
  @Input('steps') frequencySteps: FrequencyStep[] = FREQUENCY_STEP_CHANNEL_DEFAULTS;
  @Input('tooltip') tooltip = 'Frequency';
  @Output('frequencyChanged') frequencyChanged = new EventEmitter<number>();
  frequencyStep = 1;

  constructor() { }

  ngOnInit() {
  }

  validate() {
    if (this.frequency > this.max) {
      this.frequency = this.max;
    } else if (this.frequency < this.min) {
      this.frequency = this.min;
    }
    this.frequencyChanged.emit(this.frequency);
  }

  alignToStep() {
    const x = Math.floor(this.frequency / this.frequencyStep);
    const freqFloor = x * this.frequencyStep;
    if (freqFloor < this.min) {
      this.frequency = this.min;
    } else {
      this.frequency = x * this.frequencyStep;
    }
    this.frequencyChanged.emit(this.frequency);
  }
}
