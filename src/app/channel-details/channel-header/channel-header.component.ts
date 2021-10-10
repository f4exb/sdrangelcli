import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-channel-header',
  templateUrl: './channel-header.component.html',
  styleUrls: ['./channel-header.component.css']
})
export class ChannelHeaderComponent implements OnInit {
  @Input('channelType') channelType: string;
  @Input('basebandRate') basebandRate: number;
  @Input('title') title: string;
  @Input('color') colorStr: string;
  // tslint:disable-next-line:no-output-rename
  @Output('titleChanged') titleChanged = new EventEmitter<string>();
  // tslint:disable-next-line:no-output-rename
  @Output('colorChanged') colorChanged = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  setTitle() {
    this.titleChanged.emit(this.title);
  }

  setColor() {
    this.colorChanged.emit(this.colorStr);
  }
}
