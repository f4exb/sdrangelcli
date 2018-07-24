import { Component, OnInit, Input } from '@angular/core';
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

  constructor(private popupDialog: MatDialog) { }

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
    dialogConfig.position = {
      top: '0',
      left: '35%'
    }
    this.popupDialog.open(AddChannelDialogComponent, dialogConfig);
  }
}
