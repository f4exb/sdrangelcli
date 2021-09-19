import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SdrangelUrlService } from 'src/app/sdrangel-url.service';
import { FeaturePreset, FeaturePresetIdentifier } from '../featurepreset/featurepreset';
import { FeaturepresetService } from '../featurepreset/featurepreset.service';

@Component({
  selector: 'app-remove-feature-preset-dialog',
  templateUrl: './remove-feature-preset-dialog.component.html',
  styleUrls: ['./remove-feature-preset-dialog.component.css']
})
export class RemoveFeaturePresetDialogComponent implements OnInit {
  sdrangelURL: string;
  preset: FeaturePreset;
  groupName: string;

  constructor(private dialogRef: MatDialogRef<RemoveFeaturePresetDialogComponent>,
    private presetService: FeaturepresetService,
    private sdrangelUrlService: SdrangelUrlService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar: MatSnackBar) {
      this.preset = data.preset;
      this.groupName = data.groupName;
  }

  ngOnInit(): void {
    this.sdrangelUrlService.currentUrlSource.subscribe(url => {
      this.sdrangelURL = url;
    });
  }

  close() {
    this.dialogRef.close('Dismiss');
  }

  remove() {
    const presetDelete = <FeaturePresetIdentifier>{
      groupName: this.groupName,
      description: this.preset.description
    };
    this.presetService.removePreset(this.sdrangelURL, presetDelete).subscribe(
      res => {
        console.log('Removed OK', res);
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
