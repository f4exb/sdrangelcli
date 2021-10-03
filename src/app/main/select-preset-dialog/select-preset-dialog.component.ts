import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PresetGet, Presets } from '../preset/preset';

export interface PresetSelect {
  value: PresetGet;
  viewValue: string;
}

export interface PresetGroupSelect {
  name: string;
  presets: PresetSelect[];
}

@Component({
  selector: 'app-select-preset-dialog',
  templateUrl: './select-preset-dialog.component.html',
  styleUrls: ['./select-preset-dialog.component.css']
})
export class SelectPresetDialogComponent implements OnInit {
  sdrangelURL: string;
  presetGroups: PresetGroupSelect[] = [];
  devicesetIndex: number;
  selectedPreset: PresetGet;
  presets: Presets;

  constructor(private dialogRef: MatDialogRef<SelectPresetDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Presets,
    public snackBar: MatSnackBar) {
      this.presets = data;
    }

  ngOnInit(): void {
    this.fetchPresetInformation();
  }

  private fetchPresetInformation() {
    for (const presetGroup of this.presets.groups) {
      this.presetGroups.push({
        name: presetGroup.groupName,
        presets: []
      });
      for (const preset of presetGroup.presets) {
        this.presetGroups[this.presetGroups.length - 1].presets.push({
          viewValue: (preset.centerFrequency / 1000) + ' ' + preset.type + ' ' + preset.name,
          value: {
            groupName: presetGroup.groupName,
            centerFrequency: preset.centerFrequency,
            name: preset.name,
            type: preset.type
          }
        });
        if (!this.selectedPreset) {
          this.selectedPreset = {
            groupName: presetGroup.groupName,
            centerFrequency: preset.centerFrequency,
            name: preset.name,
            type: preset.type
          };
        }
      }
    }
  }

  close() {
    this.dialogRef.close(null);
  }

  save() {
    this.dialogRef.close(this.selectedPreset);
  }
}
