import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatSnackBar } from '@angular/material';
import { Location, LOCATION_DEFAULT } from './location';
import { LocationService } from './location.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';

@Component({
  selector: 'app-location-dialog',
  templateUrl: './location-dialog.component.html',
  styleUrls: ['./location-dialog.component.css']
})
export class LocationDialogComponent implements OnInit {
  sdrangelURL: string;
  title: string;
  location: Location = LOCATION_DEFAULT;

  constructor(private dialogRef: MatDialogRef<LocationDialogComponent>,
    private locationService: LocationService,
    private sdrangelUrlService: SdrangelUrlService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar: MatSnackBar) {
    this.title = data.title;
  }

  ngOnInit() {
    this.sdrangelUrlService.currentUrlSource.subscribe(url => {
      this.sdrangelURL = url;
      this.get();
    });
  }

  get() {
    this.locationService.get(this.sdrangelURL + "/location").subscribe( location => {
      this.location = location;
      this.location.latitude = this.formatCoordinate(this.location.latitude);
      this.location.longitude = this.formatCoordinate(this.location.longitude);
    });
  }

  save() {
    this.location.latitude = this.formatCoordinate(this.location.latitude);
    this.location.longitude = this.formatCoordinate(this.location.longitude);

    this.locationService.put(this.sdrangelURL + "/location", this.location).subscribe(
      res => {
        console.log("PUT OK", res);
      },
      err => {
        this.snackBar.open(err.error.message, "OK", {duration: 2000});
      }
    );
    
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }

  private formatCoordinate(x : number) : number {
    return Math.round(x*1e6)/1e6;
  }
}
