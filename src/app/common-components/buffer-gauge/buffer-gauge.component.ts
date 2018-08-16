import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-buffer-gauge',
  templateUrl: './buffer-gauge.component.html',
  styleUrls: ['./buffer-gauge.component.css']
})
export class BufferGaugeComponent implements OnInit {
  @Input() value : number;
  @Input() min : number;
  @Input() max : number;

  constructor() { }

  ngOnInit() {
  }

  getPositivePercentage() {
    if (this.value >= 0) {
      return (this.value)*(100/(this.max));
    } else {
      return 0;
    }
  }

  getNegativePercentage() {
    if (this.value < 0) {
      return (this.value)*(100/(this.min));
    } else {
      return 0;
    }
  }
}
