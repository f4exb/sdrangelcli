import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SdrangelUrlService } from 'src/app/sdrangel-url.service';
import { AddFeatureService } from './add-feature.service';

export interface FeatureType {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-add-feature-dialog',
  templateUrl: './add-feature-dialog.component.html',
  styleUrls: ['./add-feature-dialog.component.css']
})
export class AddFeatureDialogComponent implements OnInit {
  featureTypes: FeatureType[] = [];
  selectedFeatureId: string;
  sdrangelURL: string;

  constructor(private dialogRef: MatDialogRef<AddFeatureDialogComponent>,
    private addFeatureService: AddFeatureService,
    private sdrangelUrlService: SdrangelUrlService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.sdrangelUrlService.currentUrlSource.subscribe(url => {
      this.sdrangelURL = url;
      this.getAvailableFeatures(this.sdrangelURL);
    });
  }

  private getAvailableFeatures(sdrangelURL: string) {
    this.addFeatureService.getAvailableFeatures(sdrangelURL).subscribe(
      availableFeatures => {
        for (const availableFeature of availableFeatures.features) {
          this.featureTypes.push({value: availableFeature.id, viewValue: availableFeature.name});
          if (!this.selectedFeatureId) {
            this.selectedFeatureId = availableFeature.id;
          }
        }
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
    this.addFeatureService.addFeature(this.sdrangelURL, this.selectedFeatureId).subscribe(
      res => {
        console.log('Added OK', res);
        this.dialogRef.close('OK');
      },
      error => {
        console.log(error);
        this.snackBar.open(error.message, 'OK', {duration: 2000});
        this.dialogRef.close('Error');
      }
    );
  }
}
