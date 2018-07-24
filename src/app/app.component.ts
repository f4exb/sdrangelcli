import { Component } from '@angular/core';
import { SdrangelUrlService } from './sdrangel-url.service';
import { LocationDialogComponent } from './main/location-dialog/location-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
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
  version = '0.0.1';
  sdrangelURL = "http://127.0.0.1:8091/sdrangel"; // the default URL

  constructor(private sdrangelUrlService: SdrangelUrlService,
    private popupDialog: MatDialog) {
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
    dialogConfig.position = {
      top: '0',
      left: '35%'
    }
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
    dialogConfig.position = {
      top: '0',
      left: '35%'
    }
    this.popupDialog.open(LoggingDialogComponent, dialogConfig);
  }

  removeLastDevicesetDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = '150px';
    dialogConfig.width = '360px';
    dialogConfig.position = {
      top: '0',
      left: '35%'
    }
    let dialogRef = this.popupDialog.open(RemoveDevicesetDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result == "OK") {
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
    dialogConfig.position = {
      top: '0',
      left: '35%'
    }
    let dialogRef = this.popupDialog.open(AddDevicesetDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result == "OK") {
        this.validateURL(); // triggers refresh
      }
    });
  }
}
