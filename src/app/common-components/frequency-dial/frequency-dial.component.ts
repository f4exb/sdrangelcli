import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

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

}
