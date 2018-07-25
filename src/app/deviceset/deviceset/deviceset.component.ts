import { Component, OnInit, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { DeviceSet } from './deviceset';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { AddChannelDialogComponent } from '../add-channel-dialog/add-channel-dialog.component';

@Component({
  selector: 'app-deviceset',
  templateUrl: './deviceset.component.html',
  styleUrls: ['./deviceset.component.css']
})
export class DevicesetComponent implements OnInit {
  @Input() deviceSet : DeviceSet;
  @Output() devicesetChanged = new EventEmitter();

  constructor(private popupDialog: MatDialog,
    private elementRef: ElementRef) {
  }

  ngOnInit() {
  }

  getLabel() : string {
    if (this.deviceSet.samplingDevice.tx === 0) {
      return "Rx" + this.deviceSet.samplingDevice.index;
    } else {
      return "Tx" + this.deviceSet.samplingDevice.index;
    }
  }

  getCenterFrequency() : number {
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
      isTx: this.deviceSet.samplingDevice.tx !== 0
    };
    dialogConfig.height = '180px';
    dialogConfig.width = '360px';
    let dialogY = this.elementRef.nativeElement.getBoundingClientRect().y;
    let dialogX = this.elementRef.nativeElement.getBoundingClientRect().x + 10;
    dialogConfig.position = {
      top: dialogY + 'px',
      left: dialogX + 'px'
    }
    let dialogRef = this.popupDialog.open(AddChannelDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result == "OK") {
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
}
