import { Component, OnInit, Input } from '@angular/core';
import { DeviceSet } from './deviceset';

@Component({
  selector: 'app-deviceset',
  templateUrl: './deviceset.component.html',
  styleUrls: ['./deviceset.component.css']
})
export class DevicesetComponent implements OnInit {
  @Input() deviceSet : DeviceSet;
  @Input() label : string;

  constructor() { }

  ngOnInit() {
  }

}
