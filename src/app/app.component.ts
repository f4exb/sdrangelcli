import { Component } from '@angular/core';
import { SdrangelUrlService } from './sdrangel-url.service';
import { LocationDialogComponent } from './main/location-dialog/location-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material';

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
    private locationDialog: MatDialog) {
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
    this.locationDialog.open(LocationDialogComponent, dialogConfig);
  }
}
