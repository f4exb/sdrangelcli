import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-channel-monitor',
  templateUrl: './channel-monitor.component.html',
  styleUrls: ['./channel-monitor.component.css']
})
export class ChannelMonitorComponent implements OnInit {
  @Input() value: number;
  @Input() min: number;
  @Input() max: number;
  @Input() squelch: boolean;

  constructor() { }

  ngOnInit() {
  }

  getValuePercentage() {
    return (this.value - this.min) * (100 / (this.max - this.min));
  }

  getSquelchStatusColor(): string {
    if (this.squelch) {
      return 'rgb(50,180,50)';
    } else {
      return 'grey';
    }
  }

  getSquelchStatusText(): string {
    if (this.squelch) {
      return 'Squelch open';
    } else {
      return 'Squelch closed';
    }
  }
}
