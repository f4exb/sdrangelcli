import { Component, OnInit } from '@angular/core';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RemoveDevicesetService } from './remove-deviceset.service';

@Component({
  selector: 'app-remove-deviceset-dialog',
  templateUrl: './remove-deviceset-dialog.component.html',
  styleUrls: ['./remove-deviceset-dialog.component.css']
})
export class RemoveDevicesetDialogComponent implements OnInit {
  title = 'Remove last device set';
  sdrangelURL: string;

  constructor(private dialogRef: MatDialogRef<RemoveDevicesetDialogComponent>,
    private removeDevicesetService: RemoveDevicesetService,
    private sdrangelUrlService: SdrangelUrlService,
    public snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.sdrangelUrlService.currentUrlSource.subscribe(url => {
      this.sdrangelURL = url;
    });
  }

  close() {
    this.dialogRef.close('Dismiss');
  }

  delete() {
    this.removeDevicesetService.delete(this.sdrangelURL + '/deviceset').subscribe(
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
