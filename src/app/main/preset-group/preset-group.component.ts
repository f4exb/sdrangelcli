import { Component, OnInit, Input, Output, EventEmitter, ElementRef, HostListener } from '@angular/core';
import { PresetGroup } from '../preset/preset';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ImportPresetDialogComponent } from '../import-preset-dialog/import-preset-dialog.component';

@Component({
  selector: 'app-preset-group',
  templateUrl: './preset-group.component.html',
  styleUrls: ['./preset-group.component.css']
})
export class PresetGroupComponent implements OnInit {
  @Input() presetGroup : PresetGroup;
  @Output() presetGroupChanged = new EventEmitter();
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

  openImportPresetDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      groupName: this.presetGroup.groupName,
    };
    dialogConfig.height = '240px';
    dialogConfig.width = '360px';
    let dialogY = this.elementRef.nativeElement.getBoundingClientRect().y;
    let dialogX = this.elementRef.nativeElement.getBoundingClientRect().x + 10;
    if (dialogY+240 > this.height) {
      dialogY -= dialogY+240 - this.height;
    }
    dialogConfig.position = {
      top: dialogY + 'px',
      left: dialogX + 'px'
    }
    let dialogRef = this.popupDialog.open(ImportPresetDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result == "OK") {
        this.presetGroupChanged.emit(); // triggers refresh
      }
    });
  }

  presetRemoved() {
    this.presetGroupChanged.emit(); // triggers refresh
  }

  refresh() {
    this.presetGroupChanged.emit(); // triggers refresh
  }
}
