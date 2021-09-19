import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-feature-header',
  templateUrl: './feature-header.component.html',
  styleUrls: ['./feature-header.component.css']
})
export class FeatureHeaderComponent implements OnInit {
  @Input('featureType') featureType: string;
  @Input('title') title: string;
  @Input('color') colorStr: string;
  // tslint:disable-next-line:no-output-rename
  @Output('titleChanged') titleChanged = new EventEmitter<string>();
  // tslint:disable-next-line:no-output-rename
  @Output('colorChanged') colorChanged = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  setTitle() {
    this.titleChanged.emit(this.title);
  }

  setColor() {
    this.colorChanged.emit(this.colorStr);
  }
}
