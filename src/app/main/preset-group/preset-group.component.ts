import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PresetGroup } from '../preset/preset';

@Component({
  selector: 'app-preset-group',
  templateUrl: './preset-group.component.html',
  styleUrls: ['./preset-group.component.css']
})
export class PresetGroupComponent implements OnInit {
  @Input() presetGroup : PresetGroup;
  @Output() presetGroupChanged = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  openImportPresetDialog() {

  }

  presetRemoved() {
    this.presetGroupChanged.emit(); // triggers refresh
  }
}
