import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-simple-gauge',
  templateUrl: './simple-gauge.component.html',
  styleUrls: ['./simple-gauge.component.css']
})
export class SimpleGaugeComponent implements OnInit {
  @Input() value: number;
  @Input() min: number;
  @Input() max: number;
  @Input() valueText: string;
  @Input() tooltip: string;

  constructor() { }

  ngOnInit(): void {
  }

  getValuePercentage() {
    return (this.value - this.min) * (100 / (this.max - this.min));
  }

  getValueText() {
    return this.valueText;
  }

  getTooltip() {
    return this.tooltip;
  }
}
