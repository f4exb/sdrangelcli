import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { PresetService } from '../preset/preset.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { PresetImport } from '../preset/preset';

@Component({
  selector: 'app-import-preset-dialog',
  templateUrl: './import-preset-dialog.component.html',
  styleUrls: ['./import-preset-dialog.component.css']
})
export class ImportPresetDialogComponent implements OnInit {
  sdrangelURL: string;
  groupName: string;
  presetName: string;
  remoteFilePath: string;

  constructor(private dialogRef: MatDialogRef<ImportPresetDialogComponent>,
    private presetService: PresetService,
    private sdrangelUrlService: SdrangelUrlService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar: MatSnackBar) {
    this.groupName = data.groupName;
    this.presetName = data.presetName;
  }

  ngOnInit() {
    this.sdrangelUrlService.currentUrlSource.subscribe(url => {
      this.sdrangelURL = url;
    });
  }

  close() {
    this.dialogRef.close('Dismiss');
  }

  import() {
    const presetImport = <PresetImport>{
      groupName: this.groupName,
      description: this.presetName,
      filePath: this.remoteFilePath
    };
    this.presetService.importPreset(this.sdrangelURL, presetImport).subscribe(
      res => {
        console.log('Imported OK', res);
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
