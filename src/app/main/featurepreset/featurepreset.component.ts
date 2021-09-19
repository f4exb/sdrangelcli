import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { RemoveFeaturePresetDialogComponent } from '../remove-feature-preset-dialog/remove-feature-preset-dialog.component';
import { FeaturePreset } from './featurepreset';

@Component({
  selector: 'app-featurepreset',
  templateUrl: './featurepreset.component.html',
  styleUrls: ['./featurepreset.component.css']
})
export class FeaturepresetComponent implements OnInit {
  @Input('preset') preset: FeaturePreset;
  @Input('groupName') groupName: string;
  @Output() presetRemoved = new EventEmitter();
  sdrangelURL: string;
  width: number;
  height: number;

  constructor(private popupDialog: MatDialog,
    private elementRef: ElementRef) {
    this.onResize();
  }

  ngOnInit(): void {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
     this.height = window.innerHeight;
     this.width = window.innerWidth;
  }

  openRemovePresetDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      groupName: this.groupName,
      preset: this.preset
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
    const dialogRef = this.popupDialog.open(RemoveFeaturePresetDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'OK') {
        this.presetRemoved.emit(); // triggers refresh
      }
    });
  }
}
