import { Component, OnInit, Input, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';
import { Device } from './device';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ChangeDeviceDialogComponent } from '../change-device-dialog/change-device-dialog.component';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css']
})
export class DeviceComponent implements OnInit {
  @Input() device : Device;
  @Output() deviceChanged = new EventEmitter();
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

  hasSerial() : boolean {
    if (this.device && this.device.serial) {
      return true;
    } else {
      return false;
    }
  }

  getSerial() : string {
    if (this.device && this.device.serial) {
      return "["+ String(this.device.sequence) + ":" + String(this.device.streamIndex) + "] " + this.device.serial;
    } else {
      return "";
    }
  }

  openChangeDeviceDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      deviceSetIndex: this.device.index,
      isTx: this.device.tx !== 0
    };
    dialogConfig.height = '200px';
    dialogConfig.width = '400px';
    let dialogY = this.elementRef.nativeElement.getBoundingClientRect().y;
    let dialogX = this.elementRef.nativeElement.getBoundingClientRect().x + 10;
    if (dialogY+180 > this.height) {
      dialogY -= dialogY+200 - this.height;
    }
    dialogConfig.position = {
      top: dialogY + 'px',
      left: dialogX + 'px'
    }
    let dialogRef = this.popupDialog.open(ChangeDeviceDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result == "OK") {
        this.deviceChanged.emit(); // triggers refresh
      }
    });
  }
}
