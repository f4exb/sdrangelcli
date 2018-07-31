import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

export interface FrequencyStep {
  value: number;
  viewValue: number;
}

@Component({
  selector: 'app-frequency-dial',
  templateUrl: './frequency-dial.component.html',
  styleUrls: ['./frequency-dial.component.css']
})
export class FrequencyDialComponent implements OnInit {
  @Input('frequency') frequency : number;
  @Input('min') min : number;
  @Input('max') max : number;
  @Output('frequencyChanged') frequencyChanged = new EventEmitter<number>();
  frequencySteps: FrequencyStep[] = [
    {value: 0.1, viewValue: 0.1},
    {value: 0.5, viewValue: 0.5},
    {value: 1, viewValue: 1},
    {value: 5, viewValue: 5},
    {value: 6.25, viewValue: 6.25},
    {value: 25/3, viewValue: 8.33},
    {value: 10, viewValue: 10},
    {value: 12.5, viewValue: 12.5},
    {value: 25, viewValue: 25},
    {value: 100, viewValue: 100},
  ];
  frequencyStep : number = 1;

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
    let x = Math.floor(this.frequency / this.frequencyStep);
    let freqFloor = x * this.frequencyStep;
    if (freqFloor < this.min) {
      this.frequency = this.min;
    } else {
      this.frequency = x * this.frequencyStep;
    }
    this.frequencyChanged.emit(this.frequency);
  }
}
