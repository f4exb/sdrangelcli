import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FeaturePresetIdentifier } from 'src/app/main/featurepreset/featurepreset';
import { FeaturepresetService } from 'src/app/main/featurepreset/featurepreset.service';
import { SdrangelUrlService } from 'src/app/sdrangel-url.service';

export interface GroupName {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-new-feature-preset-dialog',
  templateUrl: './new-feature-preset-dialog.component.html',
  styleUrls: ['./new-feature-preset-dialog.component.css']
})
export class NewFeaturePresetDialogComponent implements OnInit {
  sdrangelURL: string;
  newGroup = false;
  groupName: string;
  newGroupName: string;
  presetDescription: string;
  groupNames: GroupName[] = [];
  featuresetIndex: number;

  constructor(private dialogRef: MatDialogRef<NewFeaturePresetDialogComponent>,
    private presetService: FeaturepresetService,
    private sdrangelUrlService: SdrangelUrlService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar: MatSnackBar) {
      this.featuresetIndex = data.featuresetIndex;
    }

  ngOnInit(): void {
    this.sdrangelUrlService.currentUrlSource.subscribe(url => {
      this.sdrangelURL = url;
      this.fetchGroupsInformation();
    });
  }

  private fetchGroupsInformation() {
    this.presetService.getInfo(this.sdrangelURL).subscribe(
      presets => {
        for (const presetGroup of presets.groups) {
          this.groupNames.push({
            value: presetGroup.groupName,
            viewValue: presetGroup.groupName
          });
          if (!this.groupName) {
            this.groupName = presetGroup.groupName;
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

  create() {
    const preset = <FeaturePresetIdentifier>{
        groupName: this.newGroup ? this.newGroupName : this.groupName,
        description: this.presetDescription
    };
    this.presetService.newPreset(this.sdrangelURL, this.featuresetIndex, preset).subscribe(
      res => {
        console.log('Created OK', res);
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
