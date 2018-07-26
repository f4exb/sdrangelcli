import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { PresetService } from '../../main/preset/preset.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { PresetLoad } from '../../main/preset/preset';

export interface GroupName {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-new-preset-dialog',
  templateUrl: './new-preset-dialog.component.html',
  styleUrls: ['./new-preset-dialog.component.css']
})
export class NewPresetDialogComponent implements OnInit {
  sdrangelURL : string;
  newGroup : boolean = false;
  groupName : string;
  newGroupName : string;
  presetName : string;
  groupNames : GroupName[] = [];
  devicesetIndex : number;

  constructor(private dialogRef: MatDialogRef<NewPresetDialogComponent>,
    private presetService: PresetService,
    private sdrangelUrlService: SdrangelUrlService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar: MatSnackBar)
  {
    this.devicesetIndex = data.devicesetIndex;
  }

  ngOnInit() {
    this.sdrangelUrlService.currentUrlSource.subscribe(url => {
      this.sdrangelURL = url;
      this.fetchGroupsInformation();
    });
  }

  private fetchGroupsInformation() {
    this.presetService.getInfo(this.sdrangelURL).subscribe(
      presets => {
        for (let presetGroup of presets.groups) {
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
        this.snackBar.open(err.error.message, "OK", {duration: 2000});
        this.dialogRef.close("Error");
      }
    )
  }

  close() {
    this.dialogRef.close("Dismiss");
  }

  create() {
    const preset = <PresetLoad>{
      deviceSetIndex: this.devicesetIndex,
      preset: {
        centerFrequency: 0,
        groupName: this.newGroup ? this.newGroupName : this.groupName,
        type: "",
        name: this.presetName
      }
    }
    this.presetService.newPreset(this.sdrangelURL, preset).subscribe(
      res => {
        console.log("Created OK", res);
        this.dialogRef.close("OK");
      },
      error => {
        console.log(error);
        this.snackBar.open(error.message, "OK", {duration: 2000});
        this.dialogRef.close("Error");
      }
    );
  }
}
