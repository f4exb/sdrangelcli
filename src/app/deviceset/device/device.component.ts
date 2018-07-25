import { Component, OnInit, Input, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';
import { Device } from './device';
import { MatDialogConfig, MatDialog, MatSnackBar } from '@angular/material';
import { ChangeDeviceDialogComponent } from '../change-device-dialog/change-device-dialog.component';
import { DeviceService } from './device.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.css']
})
export class DeviceComponent implements OnInit {
  @Input() device : Device;
  @Output() deviceChanged = new EventEmitter();
  width : number;
  height : number;
  sdrangelURL : string;

  constructor(private popupDialog: MatDialog,
    private elementRef: ElementRef,
    private deviceService: DeviceService,
    private sdrangelUrlService: SdrangelUrlService,
    public snackBar: MatSnackBar)
  {
    this.onResize();
  }

  ngOnInit() {
    this.sdrangelUrlService.currentUrlSource.subscribe(url => {
      this.sdrangelURL = url;
    });
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

  status() : string {
    return this.device.state;
  }

  getRunStatusColor() : string {
    if (this.device.state === "idle") {
      return "rgb(100,100,255)";
    } else if (this.device.state === "running") {
      return "rgb(50,180,50)";
    } else if (this.device.state === "error") {
      return "red";
    } else {
      return "grey";
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

  startDevice() {
    if (this.device.state !== "running") {
      this.deviceService.start(this.sdrangelURL, this.device.index).subscribe(
        res => {
          console.log("Started OK", res);
          this.deviceChanged.emit(); // triggers refresh
        },
        error => {
          console.log(error);
          this.snackBar.open(error.message, "OK", {duration: 2000});
        }
      )
    }
  }

  stopDevice() {
    if (this.device.state === "running") {
      this.deviceService.stop(this.sdrangelURL, this.device.index).subscribe(
        res => {
          console.log("Stopped OK", res);
          this.deviceChanged.emit(); // triggers refresh
        },
        error => {
          console.log(error);
          this.snackBar.open(error.message, "OK", {duration: 2000});
        }
      )
    }
  }
}
