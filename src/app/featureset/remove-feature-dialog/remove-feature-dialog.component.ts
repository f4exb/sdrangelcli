import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SdrangelUrlService } from 'src/app/sdrangel-url.service';
import { Feature } from '../feature/feature';
import { RemoveFeatureService } from './remove-feature.service';

@Component({
  selector: 'app-remove-feature-dialog',
  templateUrl: './remove-feature-dialog.component.html',
  styleUrls: ['./remove-feature-dialog.component.css']
})
export class RemoveFeatureDialogComponent implements OnInit {
  sdrangelURL: string;
  feature: Feature;

  constructor(private dialogRef: MatDialogRef<RemoveFeatureDialogComponent>,
    private removeFeatureService: RemoveFeatureService,
    private sdrangelUrlService: SdrangelUrlService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar: MatSnackBar) {
        this.feature = data.feature;
    }

  ngOnInit(): void {
    this.sdrangelUrlService.currentUrlSource.subscribe(url => {
        this.sdrangelURL = url;
    });
  }

  close() {
    this.dialogRef.close('Dismiss');
  }

  remove() {
    this.removeFeatureService.removeFeature(this.sdrangelURL, this.feature.index).subscribe(
      res => {
        console.log('Removed OK', res);
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
