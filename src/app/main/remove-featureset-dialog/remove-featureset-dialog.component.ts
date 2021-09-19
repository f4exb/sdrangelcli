import { Component, OnInit } from '@angular/core';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RemoveFeaturesetService } from './remove-featureset.service';

@Component({
  selector: 'app-remove-featureset-dialog',
  templateUrl: './remove-featureset-dialog.component.html',
  styleUrls: ['./remove-featureset-dialog.component.css']
})
export class RemoveFeaturesetDialogComponent implements OnInit {
  title = 'Remove last feature set';
  sdrangelURL: string;

  constructor(private dialogRef: MatDialogRef<RemoveFeaturesetDialogComponent>,
    private removeFeaturesetService: RemoveFeaturesetService,
    private sdrangelUrlService: SdrangelUrlService,
    public snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.sdrangelUrlService.currentUrlSource.subscribe(url => {
      this.sdrangelURL = url;
    });
  }

  close() {
    this.dialogRef.close('Dismiss');
  }

  delete() {
    this.removeFeaturesetService.delete(this.sdrangelURL + '/featureset').subscribe(
      res => {
        console.log('DELETE OK', res);
        this.dialogRef.close('OK');
      },
      err => {
        this.snackBar.open(err.error.message, 'OK', {duration: 2000});
        this.dialogRef.close('Error');
      }
    );
  }
}
