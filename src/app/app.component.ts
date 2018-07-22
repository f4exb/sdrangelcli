import { Component } from '@angular/core';
import { SdrangelUrlService } from './sdrangel-url.service';
import { LocationDialogComponent } from './main/location-dialog/location-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { LoggingDialogComponent } from './main/logging-dialog/logging-dialog.component';
import { RemoveDevicesetDialogComponent } from './main/remove-deviceset-dialog/remove-deviceset-dialog.component';

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
    dialogConfig.height = '30%';
    dialogConfig.width = '30%';
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
    dialogConfig.height = '35%';
    dialogConfig.width = '30%';
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
    dialogConfig.height = '20%';
    dialogConfig.width = '30%';
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
}
