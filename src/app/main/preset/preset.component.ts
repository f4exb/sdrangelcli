import { Component, OnInit, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { Preset } from './preset';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { RemovePresetDialogComponent } from '../remove-preset-dialog/remove-preset-dialog.component';
import { ExportPresetDialogComponent } from '../export-preset-dialog/export-preset-dialog.component';

@Component({
  selector: 'app-preset',
  templateUrl: './preset.component.html',
  styleUrls: ['./preset.component.css']
})
export class PresetComponent implements OnInit {
  @Input('preset') preset : Preset;
  @Input('groupName') groupName : string;
  @Output() presetRemoved = new EventEmitter();
  sdrangelURL: string;
  width: number;
  height: number;

  constructor(private popupDialog: MatDialog,
    private elementRef: ElementRef)
  {
    this.onResize();
  }

  ngOnInit() {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
     this.height = window.innerHeight;
     this.width = window.innerWidth;
  }

  openRemovePresetDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      groupName: this.groupName,
      preset: this.preset
    };
    dialogConfig.height = '180px';
    dialogConfig.width = '360px';
    let dialogY = this.elementRef.nativeElement.getBoundingClientRect().y;
    let dialogX = this.elementRef.nativeElement.getBoundingClientRect().x + 10;
    if (dialogY+180 > this.height) {
      dialogY -= dialogY+180 - this.height;
    }
    dialogConfig.position = {
      top: dialogY + 'px',
      left: dialogX + 'px'
    }
    let dialogRef = this.popupDialog.open(RemovePresetDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result == "OK") {
        this.presetRemoved.emit(); // triggers refresh
      }
    });
  }

  openExportPresetDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      groupName: this.groupName,
      centerFrequency: this.preset.centerFrequency,
      name: this.preset.name,
      type: this.preset.type
    };
    dialogConfig.height = '180px';
    dialogConfig.width = '360px';
    let dialogY = this.elementRef.nativeElement.getBoundingClientRect().y;
    let dialogX = this.elementRef.nativeElement.getBoundingClientRect().x + 10;
    if (dialogY+180 > this.height) {
      dialogY -= dialogY+180 - this.height;
    }
    dialogConfig.position = {
      top: dialogY + 'px',
      left: dialogX + 'px'
    }
    this.popupDialog.open(ExportPresetDialogComponent, dialogConfig);
  }
}
