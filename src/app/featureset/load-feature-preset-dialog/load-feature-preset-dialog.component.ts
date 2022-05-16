import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FeaturePresetIdentifier } from 'src/app/main/featurepreset/featurepreset';
import { FeaturepresetService } from 'src/app/main/featurepreset/featurepreset.service';
import { SdrangelUrlService } from 'src/app/sdrangel-url.service';

export interface PresetSelect {
  value: FeaturePresetIdentifier;
  viewValue: string;
}

export interface PresetGroupSelect {
  name: string;
  presets: PresetSelect[];
}

@Component({
  selector: 'app-load-feature-preset-dialog',
  templateUrl: './load-feature-preset-dialog.component.html',
  styleUrls: ['./load-feature-preset-dialog.component.css']
})
export class LoadFeaturePresetDialogComponent implements OnInit {
  sdrangelURL: string;
  presetGroups: PresetGroupSelect[] = [];
  selectedPreset: FeaturePresetIdentifier;

  constructor(private dialogRef: MatDialogRef<LoadFeaturePresetDialogComponent>,
    private presetService: FeaturepresetService,
    private sdrangelUrlService: SdrangelUrlService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.sdrangelUrlService.currentUrlSource.subscribe(url => {
      this.sdrangelURL = url;
      this.fetchPresetInformation();
    });
  }

  private fetchPresetInformation() {
    this.presetService.getInfo(this.sdrangelURL).subscribe(
      presets => {
        for (const presetGroup of presets.groups) {
          this.presetGroups.push({
            name: presetGroup.groupName,
            presets: []
          });
          for (const preset of presetGroup.presets) {
            this.presetGroups[this.presetGroups.length - 1].presets.push({
              viewValue: preset.description,
              value: {
                  groupName: presetGroup.groupName,
                  description: preset.description
              }
            });
            if (!this.selectedPreset) {
              this.selectedPreset = {
                  groupName: presetGroup.groupName,
                  description: preset.description,
              };
            }
          }
        }
      },
      err => {
        this.snackBar.open(err.error.message, 'OK', {duration: 2000});
        this.dialogRef.close('Error');
      }
    );
  }

  close() {
    this.dialogRef.close('Dismiss');
  }

  load() {
    this.presetService.loadPreset(this.sdrangelURL, this.selectedPreset).subscribe(
      res => {
        console.log('Loaded OK', res);
        this.dialogRef.close('OK');
      },
      error => {
        console.log(error);
        this.snackBar.open(error.message, 'OK', {duration: 2000});
        this.dialogRef.close('Error');
      }
    );
  }
}
