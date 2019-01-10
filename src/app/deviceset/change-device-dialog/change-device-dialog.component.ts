import { Component, OnInit, Inject } from '@angular/core';
import { AvailableDevice, NewDevice } from './devices';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { ChangeDeviceService } from './change-device.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';

export interface DeviceType {
  value: number; // this is the index in list of available devices
  viewValue: string;
}

@Component({
  selector: 'app-change-device-dialog',
  templateUrl: './change-device-dialog.component.html',
  styleUrls: ['./change-device-dialog.component.css']
})
export class ChangeDeviceDialogComponent implements OnInit {
  sdrangelURL: string;
  deviceTypes: DeviceType[] = []; // this is used by the selector
  availableDevices: AvailableDevice[] = [];
  selectedDeviceTypeIndex: number; // this is the index of selected item in the list of available devices
  deviceSetIndex: number;
  isTx: boolean;

  constructor(private dialogRef: MatDialogRef<ChangeDeviceDialogComponent>,
    private changeDeviceService: ChangeDeviceService,
    private sdrangelUrlService: SdrangelUrlService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar: MatSnackBar) {
      this.deviceSetIndex = data.deviceSetIndex;
      this.isTx = data.isTx;
  }

  ngOnInit() {
    this.sdrangelUrlService.currentUrlSource.subscribe(url => {
      this.sdrangelURL = url;
      this.getAvailableDevices(this.sdrangelURL);
    });
  }

  private getAvailableDevices(sdrangelURL: string) {
    this.changeDeviceService.getAvailableDevices(sdrangelURL, this.isTx).subscribe(
      availableDevices => {
        availableDevices.devices.forEach((device, index) => {
          this.availableDevices.push(device);
          this.deviceTypes.push({value: index, viewValue: device.displayedName});
          if (!this.selectedDeviceTypeIndex) {
            this.selectedDeviceTypeIndex = index;
          }
        });
      },
      error => {
        this.snackBar.open(error.message, 'OK', {duration: 2000});
      }
    );
  }

  close() {
    this.dialogRef.close('Dismiss');
  }

  save() {
    const device = this.availableDevices[this.selectedDeviceTypeIndex]; // selected device full data
    const newDevice: NewDevice = <NewDevice>{};
    newDevice.tx = device.tx;
    newDevice.hwType = device.hwType;
    if (device.serial) {
      newDevice.serial = device.serial;
    } else {
      newDevice.sequence = device.sequence;
    }
    this.changeDeviceService.changeDevice(this.sdrangelURL, this.deviceSetIndex, newDevice).subscribe(
      res => {
        console.log('Changed OK', res);
        this.dialogRef.close('OK');
      },
      error => {
        console.log(error);
        this.snackBar.open(error.message, 'OK', {duration: 2000});
        this.dialogRef.close('Error');
      }
    );  }
}
