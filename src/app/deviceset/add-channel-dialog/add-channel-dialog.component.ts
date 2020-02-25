import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { AddChannelService } from './add-channel.service';

export interface ChannelType {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-add-channel-dialog',
  templateUrl: './add-channel-dialog.component.html',
  styleUrls: ['./add-channel-dialog.component.css']
})
export class AddChannelDialogComponent implements OnInit {
  channelTypes: ChannelType[] = [];
  selectedChannelId: string;
  deviceSetIndex: number;
  isTx: boolean;
  sdrangelURL: string;

  constructor(private dialogRef: MatDialogRef<AddChannelDialogComponent>,
    private addChannelService: AddChannelService,
    private sdrangelUrlService: SdrangelUrlService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar: MatSnackBar) {
      this.deviceSetIndex = data.deviceSetIndex;
      this.isTx = data.isTx;
  }

  ngOnInit() {
    this.sdrangelUrlService.currentUrlSource.subscribe(url => {
      this.sdrangelURL = url;
      this.getAvailableChannels(this.sdrangelURL);
    });
  }

  private getAvailableChannels(sdrangelURL: string) {
    this.addChannelService.getAvailableChannels(sdrangelURL, this.isTx).subscribe(
      availableChannels => {
        for (const availableChannel of availableChannels.channels) {
          this.channelTypes.push({value: availableChannel.id, viewValue: availableChannel.name});
          if (!this.selectedChannelId) {
            this.selectedChannelId = availableChannel.id;
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
    this.addChannelService.addChannel(this.sdrangelURL, this.deviceSetIndex, this.isTx, this.selectedChannelId).subscribe(
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
