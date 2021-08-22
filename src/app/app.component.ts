import { Component, ElementRef } from '@angular/core';
import { SdrangelUrlService } from './sdrangel-url.service';
import { LocationDialogComponent } from './main/location-dialog/location-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LoggingDialogComponent } from './main/logging-dialog/logging-dialog.component';
import { RemoveDevicesetDialogComponent } from './main/remove-deviceset-dialog/remove-deviceset-dialog.component';
import { AddDevicesetDialogComponent } from './main/add-deviceset-dialog/add-deviceset-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'SDRangelCli';
  version = '1.2.2';
  sdrangelURL = 'http://127.0.0.1:8091/sdrangel'; // the default URL

  constructor(private sdrangelUrlService: SdrangelUrlService,
    private popupDialog: MatDialog,
    private elementRef: ElementRef) {
      this.sdrangelURL = 'http://' + window.location.hostname + ':8091/sdrangel';
  }

  validateURL() {
    this.sdrangelUrlService.changeURL(this.sdrangelURL);
  }

  openLocationDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'Station Location'
    };
    dialogConfig.height = '290px';
    dialogConfig.width = '360px';
    const dialogY = this.elementRef.nativeElement.getBoundingClientRect().y;
    const dialogX = this.elementRef.nativeElement.getBoundingClientRect().x + 10;
    dialogConfig.position = {
      top: dialogY + 'px',
      left: dialogX + 'px'
    };
    this.popupDialog.open(LocationDialogComponent, dialogConfig);
  }

  openLoggingDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      title: 'Logging options'
    };
    dialogConfig.height = '380px';
    dialogConfig.width = '360px';
    const dialogY = this.elementRef.nativeElement.getBoundingClientRect().y;
    const dialogX = this.elementRef.nativeElement.getBoundingClientRect().x + 10;
    dialogConfig.position = {
      top: dialogY + 'px',
      left: dialogX + 'px'
    };
    this.popupDialog.open(LoggingDialogComponent, dialogConfig);
  }

  removeLastDevicesetDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = '150px';
    dialogConfig.width = '360px';
    const dialogY = this.elementRef.nativeElement.getBoundingClientRect().y;
    const dialogX = this.elementRef.nativeElement.getBoundingClientRect().x + 10;
    dialogConfig.position = {
      top: dialogY + 'px',
      left: dialogX + 'px'
    };
    const dialogRef = this.popupDialog.open(RemoveDevicesetDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'OK') {
        this.validateURL(); // triggers refresh
      }
    });
  }

  addDevicesetDialog(isTx: boolean) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      isTx: isTx
    };
    dialogConfig.height = '150px';
    dialogConfig.width = '360px';
    const dialogY = this.elementRef.nativeElement.getBoundingClientRect().y;
    const dialogX = this.elementRef.nativeElement.getBoundingClientRect().x + 10;
    dialogConfig.position = {
      top: dialogY + 'px',
      left: dialogX + 'px'
    };
    const dialogRef = this.popupDialog.open(AddDevicesetDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'OK') {
        this.validateURL(); // triggers refresh
      }
    });
  }
}
