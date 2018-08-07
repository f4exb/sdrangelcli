import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CWKeyerSettings, CWKEYER_SETTINGS_DEFAULT } from './cw-keyer';

interface CWMode {
  value: number,
  viewValue: string
}

@Component({
  selector: 'app-cw-keyer',
  templateUrl: './cw-keyer.component.html',
  styleUrls: ['./cw-keyer.component.css']
})
export class CwKeyerComponent implements OnInit {
  @Input('settings') settings: CWKeyerSettings = CWKEYER_SETTINGS_DEFAULT;
  @Output('settingsChanged') settingsChanged = new EventEmitter<CWKeyerSettings>();
  cwModes: CWMode[] = [
    { value: 0, viewValue: "None" },
    { value: 1, viewValue: "Text" },
    { value: 1, viewValue: "Dots" },
    { value: 1, viewValue: "Dashes" },
  ];

  constructor() { }

  ngOnInit() {
  }

  setSettings() {
    this.settingsChanged.emit(this.settings);
  }
}
