import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CWKeyerSettings, CWKEYER_SETTINGS_DEFAULT } from './cw-keyer';
import { MatCheckboxChange } from '@angular/material';

interface CWMode {
  value: number;
  viewValue: string;
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
    { value: 0, viewValue: 'None' },
    { value: 1, viewValue: 'Text' },
    { value: 2, viewValue: 'Dots' },
    { value: 3, viewValue: 'Dashes' },
  ];
  loop: boolean;

  constructor() {
    this.loop = this.settings.loop !== 0;
  }

  ngOnInit() {
    this.loop = this.settings.loop !== 0;
  }

  setSettings() {
    this.settingsChanged.emit(this.settings);
  }

  setMode() {
    const newSettings: CWKeyerSettings = <CWKeyerSettings>{};
    newSettings.mode = this.settings.mode;
    this.settingsChanged.emit(newSettings);
  }

  getLoop(): boolean {
    return this.settings.loop !== 0;
  }

  setLoop(change: MatCheckboxChange) {
    const newSettings: CWKeyerSettings = <CWKeyerSettings>{};
    newSettings.loop = change.checked ? 1 : 0;
    this.settingsChanged.emit(newSettings);
  }

  setWPM() {
    const newSettings: CWKeyerSettings = <CWKeyerSettings>{};
    newSettings.wpm = this.settings.wpm;
    this.settingsChanged.emit(newSettings);
  }

  setText() {
    const newSettings: CWKeyerSettings = <CWKeyerSettings>{};
    newSettings.text = this.settings.text;
    this.settingsChanged.emit(newSettings);
  }
}
