import { Component, OnInit, Input, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';
import { Channel } from './channel';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { RemoveChannelDialogComponent } from '../remove-channel-dialog/remove-channel-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.css']
})
export class ChannelComponent implements OnInit {
  @Input('channel') channel: Channel;
  @Input('centerFrequency') centerFrequency: number;
  @Input('devicesetIndex') devicesetIndex: number;
  @Output() channelRemoved = new EventEmitter();
  width: number;
  height: number;

  constructor(private popupDialog: MatDialog,
    private elementRef: ElementRef,
    private router: Router) {
      this.onResize();
  }

  ngOnInit() {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
     this.height = window.innerHeight;
     this.width = window.innerWidth;
  }

  editChannel() {
    this.router.navigate(['../device/' + this.devicesetIndex + '/channel/' + this.channel.index]);
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
    const dialogX = this.elementRef.nativeElement.getBoundingClientRect().x + 10;
    if (dialogY + 180 > this.height) {
      dialogY -= dialogY + 180 - this.height;
    }
    dialogConfig.position = {
      top: dialogY + 'px',
      left: dialogX + 'px'
    };
    const dialogRef = this.popupDialog.open(RemoveChannelDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'OK') {
        this.channelRemoved.emit(); // triggers refresh
      }
    });
  }
}
