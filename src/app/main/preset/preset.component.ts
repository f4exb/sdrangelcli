import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Preset } from './preset';

@Component({
  selector: 'app-preset',
  templateUrl: './preset.component.html',
  styleUrls: ['./preset.component.css']
})
export class PresetComponent implements OnInit {
  @Input('preset') preset : Preset;
  @Input('groupName') groupName : string;
  @Output() presetRemoved = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  openRemovePresetDialog() {

  }

  openExportPresetDialog() {

  }
}
