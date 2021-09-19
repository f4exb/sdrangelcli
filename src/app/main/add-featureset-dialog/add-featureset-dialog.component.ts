import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddFeaturesetService } from './add-fatureset.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';

@Component({
  selector: 'app-add-featureset-dialog',
  templateUrl: './add-featureset-dialog.component.html',
  styleUrls: ['./add-featureset-dialog.component.css']
})
export class AddFeaturesetDialogComponent implements OnInit {
  title: string;
  sdrangelURL: string;

  constructor(private dialogRef: MatDialogRef<AddFeaturesetDialogComponent>,
    private addDevicesetService: AddFeaturesetService,
    private sdrangelUrlService: SdrangelUrlService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar: MatSnackBar) {
      this.title = 'Add feature set';
  }

  ngOnInit() {
    this.sdrangelUrlService.currentUrlSource.subscribe(url => {
      this.sdrangelURL = url;
    });
  }

  close() {
    this.dialogRef.close('Dismiss');
  }

  add() {
    this.addDevicesetService.add(this.sdrangelURL + '/featureset').subscribe(
      res => {
        console.log('ADD OK', res);
        this.dialogRef.close('OK');
      },
      err => {
        this.snackBar.open(err.error.message, 'OK', {duration: 2000});
        this.dialogRef.close('Error');
      }
    );
  }
}
