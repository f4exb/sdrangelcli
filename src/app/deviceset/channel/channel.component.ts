import { Component, OnInit, Input, ElementRef, Output, EventEmitter } from '@angular/core';
import { Channel } from './channel'
import { MatDialogConfig, MatDialog } from '@angular/material';
import { RemoveChannelDialogComponent } from '../remove-channel-dialog/remove-channel-dialog.component';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit {
  @Input('channel') channel : Channel;
  @Input('centerFrequency') centerFrequency : number;
  @Input('devicesetIndex') devicesetIndex : number;
  @Output() channelRemoved = new EventEmitter();

  constructor(private popupDialog: MatDialog,
    private elementRef: ElementRef) { }

  ngOnInit() {
  }

  openRemoveChannelDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      deviceSetIndex: this.devicesetIndex,
      centerFrequency: this.centerFrequency,
      channel: this.channel
    };
    dialogConfig.height = '180px';
    dialogConfig.width = '360px';
    let dialogY = this.elementRef.nativeElement.getBoundingClientRect().y;
    let dialogX = this.elementRef.nativeElement.getBoundingClientRect().x + 10;
    dialogConfig.position = {
      top: dialogY + 'px',
      left: dialogX + 'px'
    }
    let dialogRef = this.popupDialog.open(RemoveChannelDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result == "OK") {
        this.channelRemoved.emit(); // triggers refresh
      }
    });
  }  
}
