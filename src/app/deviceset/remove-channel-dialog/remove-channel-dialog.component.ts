import { Component, OnInit, Inject } from '@angular/core';
import { Channel } from '../channel/channel';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { RemoveChannelService } from './remove-channel.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';

@Component({
  selector: 'app-remove-channel-dialog',
  templateUrl: './remove-channel-dialog.component.html',
  styleUrls: ['./remove-channel-dialog.component.css']
})
export class RemoveChannelDialogComponent implements OnInit {
  sdrangelURL: string;
  centerFrequency: number;
  channel: Channel;
  deviceSetIndex: number;
  channelIndex: number;

  constructor(private dialogRef: MatDialogRef<RemoveChannelDialogComponent>,
    private removeChannelService : RemoveChannelService,
    private sdrangelUrlService: SdrangelUrlService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar: MatSnackBar) 
  {
    this.channel = data.channel;
    this.centerFrequency = data.centerFrequency;
    this.deviceSetIndex = data.deviceSetIndex;
  }

  ngOnInit() {
    this.sdrangelUrlService.currentUrlSource.subscribe(url => {
      this.sdrangelURL = url;
    });    
  }

  close() {
    this.dialogRef.close("Dismiss");
  }

  remove() {
    this.removeChannelService.removeChannel(this.sdrangelURL, this.deviceSetIndex, this.channel.index).subscribe(
      res => {
        console.log("Removed OK", res);
        this.dialogRef.close("OK");
      },
      error => {
        console.log(error);
        this.snackBar.open(error.message, "OK", {duration: 2000});
        this.dialogRef.close("Error");
      }
    );
  }  
}
