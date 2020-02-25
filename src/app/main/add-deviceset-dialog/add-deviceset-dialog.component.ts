import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddDevicesetService } from './add-deviceset.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';

@Component({
  selector: 'app-add-deviceset-dialog',
  templateUrl: './add-deviceset-dialog.component.html',
  styleUrls: ['./add-deviceset-dialog.component.css']
})
export class AddDevicesetDialogComponent implements OnInit {
  isTx: boolean;
  title: string;
  sdrangelURL: string;

  constructor(private dialogRef: MatDialogRef<AddDevicesetDialogComponent>,
    private addDevicesetService: AddDevicesetService,
    private sdrangelUrlService: SdrangelUrlService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar: MatSnackBar) {
      this.isTx = data.isTx;
      this.title = this.isTx ? 'Add sink device set' : 'Add source device set';
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
    this.addDevicesetService.add(this.sdrangelURL + '/deviceset', this.isTx).subscribe(
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
