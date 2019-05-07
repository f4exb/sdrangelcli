import { Component, OnInit, Input, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';
import { DeviceSet } from './deviceset';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { AddChannelDialogComponent } from '../add-channel-dialog/add-channel-dialog.component';
import { LoadPresetDialogComponent } from '../load-preset-dialog/load-preset-dialog.component';
import { SavePresetDialogComponent } from '../save-preset-dialog/save-preset-dialog.component';
import { NewPresetDialogComponent } from '../new-preset-dialog/new-preset-dialog.component';

@Component({
  selector: 'app-deviceset',
  templateUrl: './deviceset.component.html',
  styleUrls: ['./deviceset.component.css']
})
export class DevicesetComponent implements OnInit {
  @Input() deviceSet: DeviceSet;
  @Output() devicesetChanged = new EventEmitter();
  width: number;
  height: number;

  constructor(private popupDialog: MatDialog,
    private elementRef: ElementRef) {
      this.onResize();
  }

  ngOnInit() {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
     this.height = window.innerHeight;
     this.width = window.innerWidth;
  }

  getLabel(): string {
    if (this.deviceSet.samplingDevice.direction === 0) {
      return 'Rx' + this.deviceSet.samplingDevice.index;
    } else {
      return 'Tx' + this.deviceSet.samplingDevice.index;
    }
  }

  getCenterFrequency(): number {
    if (this.deviceSet.samplingDevice) {
      return this.deviceSet.samplingDevice.centerFrequency;
    } else {
      return 0;
    }
  }

  openAddChannelDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      deviceSetIndex: this.deviceSet.samplingDevice.index,
      isTx: this.deviceSet.samplingDevice.direction !== 0
    };
    dialogConfig.height = '180px';
    dialogConfig.width = '360px';
    let dialogY = this.elementRef.nativeElement.getBoundingClientRect().y;
    const dialogX = this.elementRef.nativeElement.getBoundingClientRect().x + 10;
    if (dialogY + 180 > this.height) {
      dialogY -= dialogY + 180 - this.height;
    }
    dialogConfig.position = {
      top: dialogY + 'px',
      left: dialogX + 'px'
    };
    const dialogRef = this.popupDialog.open(AddChannelDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'OK') {
        this.devicesetChanged.emit(); // triggers refresh
      }
    });
  }

  openLoadPresetDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      devicesetIndex: this.deviceSet.samplingDevice.index
    };
    dialogConfig.height = '180px';
    dialogConfig.width = '360px';
    let dialogY = this.elementRef.nativeElement.getBoundingClientRect().y;
    const dialogX = this.elementRef.nativeElement.getBoundingClientRect().x + 10;
    if (dialogY + 180 > this.height) {
      dialogY -= dialogY + 180 - this.height;
    }
    dialogConfig.position = {
      top: dialogY + 'px',
      left: dialogX + 'px'
    };
    const dialogRef = this.popupDialog.open(LoadPresetDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'OK') {
        this.devicesetChanged.emit(); // triggers refresh
      }
    });
  }

  openSavePresetDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      devicesetIndex: this.deviceSet.samplingDevice.index
    };
    dialogConfig.height = '180px';
    dialogConfig.width = '360px';
    let dialogY = this.elementRef.nativeElement.getBoundingClientRect().y;
    const dialogX = this.elementRef.nativeElement.getBoundingClientRect().x + 10;
    if (dialogY + 180 > this.height) {
      dialogY -= dialogY + 180 - this.height;
    }
    dialogConfig.position = {
      top: dialogY + 'px',
      left: dialogX + 'px'
    };
    const dialogRef = this.popupDialog.open(SavePresetDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'OK') {
        this.devicesetChanged.emit(); // triggers refresh
      }
    });
  }

  openNewPresetDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      devicesetIndex: this.deviceSet.samplingDevice.index
    };
    dialogConfig.height = '260px';
    dialogConfig.width = '360px';
    let dialogY = this.elementRef.nativeElement.getBoundingClientRect().y;
    const dialogX = this.elementRef.nativeElement.getBoundingClientRect().x + 10;
    if (dialogY + 260 > this.height) {
      dialogY -= dialogY + 260 - this.height;
    }
    dialogConfig.position = {
      top: dialogY + 'px',
      left: dialogX + 'px'
    };
    const dialogRef = this.popupDialog.open(NewPresetDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'OK') {
        this.devicesetChanged.emit(); // triggers refresh
      }
    });
  }

  deviceChanged() {
    this.devicesetChanged.emit(); // triggers refresh
  }

  channelRemoved() {
    this.devicesetChanged.emit(); // triggers refresh
  }

  refresh() {
    this.devicesetChanged.emit(); // triggers refresh
  }
}
