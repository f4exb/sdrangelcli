import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Utils } from 'src/app/common-components/utils';
import { RemoveFeatureDialogComponent } from '../remove-feature-dialog/remove-feature-dialog.component';
import { Feature } from './feature';

@Component({
  selector: 'app-feature',
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.css']
})
export class FeatureComponent implements OnInit {
  @Input('feature') feature: Feature;
  @Output() featureRemoved = new EventEmitter();
  width: number;
  height: number;

  constructor(private popupDialog: MatDialog,
    private elementRef: ElementRef,
    private router: Router) {
      this.onResize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.height = window.innerHeight;
    this.width = window.innerWidth;
  }

  ngOnInit(): void {
  }

  editFeature() {
    this.router.navigate(['../featureset/feature/' + this.feature.index]);
  }

  openRemoveFeatureDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      feature: this.feature
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
    const dialogRef = this.popupDialog.open(RemoveFeatureDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(async result => {
      if (result === 'OK') {
        await Utils.delay(500);
        this.featureRemoved.emit(); // triggers refresh
      }
    });
  }
}
