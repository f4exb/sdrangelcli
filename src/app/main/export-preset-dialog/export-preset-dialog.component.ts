import { Component, OnInit, Inject } from '@angular/core';
import { PresetDelete, PresetExport } from '../preset/preset';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PresetService } from '../preset/preset.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';

@Component({
  selector: 'app-export-preset-dialog',
  templateUrl: './export-preset-dialog.component.html',
  styleUrls: ['./export-preset-dialog.component.css']
})
export class ExportPresetDialogComponent implements OnInit {
  sdrangelURL: string;
  remoteFilePath: string;
  preset: PresetDelete;

  constructor(private dialogRef: MatDialogRef<ExportPresetDialogComponent>,
    private presetService: PresetService,
    private sdrangelUrlService: SdrangelUrlService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar: MatSnackBar) {
    this.preset = data.preset;
  }

  ngOnInit() {
    this.sdrangelUrlService.currentUrlSource.subscribe(url => {
      this.sdrangelURL = url;
    });
  }

  close() {
    this.dialogRef.close('Dismiss');
  }

  export() {
    const presetExport = <PresetExport>{
      filePath: this.remoteFilePath,
      preset: this.preset
    };
    this.presetService.exportPreset(this.sdrangelURL, presetExport).subscribe(
      res => {
        console.log('Exported OK', res);
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
