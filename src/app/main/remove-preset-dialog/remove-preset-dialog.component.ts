import { Component, OnInit, Inject } from '@angular/core';
import { Preset, PresetDelete } from '../preset/preset';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { PresetService } from '../preset/preset.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';

@Component({
  selector: 'app-remove-preset-dialog',
  templateUrl: './remove-preset-dialog.component.html',
  styleUrls: ['./remove-preset-dialog.component.css']
})
export class RemovePresetDialogComponent implements OnInit {
  sdrangelURL: string;
  centerFrequency: number;
  preset: Preset;
  groupName: string;

  constructor(private dialogRef: MatDialogRef<RemovePresetDialogComponent>,
    private presetService : PresetService,
    private sdrangelUrlService: SdrangelUrlService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar: MatSnackBar)
  {
    this.preset = data.preset;
    this.groupName = data.groupName;
  }

  ngOnInit() {
    this.sdrangelUrlService.currentUrlSource.subscribe(url => {
      this.sdrangelURL = url;
    });
  }

  close() {
    this.dialogRef.close("Dismiss");
  }

  remove() {
    const presetDelete = <PresetDelete>{
      groupName: this.groupName,
      centerFrequency: this.preset.centerFrequency,
      name: this.preset.name,
      type: this.preset.type
    }
    this.presetService.removePreset(this.sdrangelURL, presetDelete).subscribe(
      res => {
        console.log("Removed OK", res);
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
