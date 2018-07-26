import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { PresetService } from '../preset/preset.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { PresetLoad } from '../preset/preset';

export interface PresetSelect {
  value: PresetLoad,
  viewValue: string
}

export interface PresetGroupSelect {
  disabled?: boolean,
  name: string,
  preset: PresetSelect[]
}

@Component({
  selector: 'app-load-preset-dialog',
  templateUrl: './load-preset-dialog.component.html',
  styleUrls: ['./load-preset-dialog.component.css']
})
export class LoadPresetDialogComponent implements OnInit {
  sdrangelURL : string;
  presetGroups: PresetGroupSelect[];

  constructor(private dialogRef: MatDialogRef<LoadPresetDialogComponent>,
    private presetService: PresetService,
    private sdrangelUrlService: SdrangelUrlService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar: MatSnackBar)
  {

  }

  ngOnInit() {
  }

  close() {

  }

  load() {

  }
}
