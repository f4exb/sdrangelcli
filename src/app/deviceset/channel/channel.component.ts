import { Component, OnInit, Input } from '@angular/core';
import { Channel } from './channel'

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit {
  @Input() channel : Channel;

  constructor() { }

  ngOnInit() {
  }

}
