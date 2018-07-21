import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { Location, LOCATION_DEFAULT } from './location';
import { LocationService } from './location.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';

@Component({
  selector: 'app-location-dialog',
  templateUrl: './location-dialog.component.html',
  styleUrls: ['./location-dialog.component.css']
})
export class LocationDialogComponent implements OnInit {
  @Input() sdrangelURL: string;
  title: string;
  location: Location = LOCATION_DEFAULT;

  constructor(private dialogRef: MatDialogRef<LocationDialogComponent>,
    private locationService: LocationService,
    private sdrangelUrlService: SdrangelUrlService,
    @Inject(MAT_DIALOG_DATA) public data: any) {
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
    });
  }

  save() {
    this.locationService.put(this.sdrangelURL + "/location", this.location);
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }
}
