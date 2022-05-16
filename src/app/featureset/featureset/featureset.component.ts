import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Utils } from 'src/app/common-components/utils';
import { AddFeatureDialogComponent } from '../add-feature-dialog/add-feature-dialog.component';
import { LoadFeaturePresetDialogComponent } from '../load-feature-preset-dialog/load-feature-preset-dialog.component';
import { NewFeaturePresetDialogComponent } from '../new-feature-preset-dialog/new-feature-preset-dialog.component';
import { SaveFeaturePresetDialogComponent } from '../save-feature-preset-dialog/save-feature-preset-dialog.component';
import { FeatureSet } from './featureset';

@Component({
  selector: 'app-featureset',
  templateUrl: './featureset.component.html',
  styleUrls: ['./featureset.component.css']
})
export class FeaturesetComponent implements OnInit {
  @Input() featureSet: FeatureSet;
  @Output() featuresetChanged = new EventEmitter();
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

  getLabel(): string {
   return 'Features';
  }

  openAddFeatureDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
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
    const dialogRef = this.popupDialog.open(AddFeatureDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'OK') {
        this.featuresetChanged.emit(); // triggers refresh
      }
    });
  }

  openLoadPresetDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
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
    const dialogRef = this.popupDialog.open(LoadFeaturePresetDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(async result => {
      if (result === 'OK') {
        await Utils.delay(500);
        this.featuresetChanged.emit(); // triggers refresh
      }
    });
  }

  openSavePresetDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
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
    const dialogRef = this.popupDialog.open(SaveFeaturePresetDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'OK') {
        this.featuresetChanged.emit(); // triggers refresh
      }
    });
  }

  openNewPresetDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = '260px';
    dialogConfig.width = '360px';
    let dialogY = this.elementRef.nativeElement.getBoundingClientRect().y;
    const dialogX = this.elementRef.nativeElement.getBoundingClientRect().x + 10;
    if (dialogY + 260 > this.height) {
      dialogY -= dialogY + 260 - this.height;
    }
    dialogConfig.position = {
      top: dialogY + 'px',
      left: dialogX + 'px'
    };
    const dialogRef = this.popupDialog.open(NewFeaturePresetDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'OK') {
        this.featuresetChanged.emit(); // triggers refresh
      }
    });
  }

  featureRemoved() {
    this.featuresetChanged.emit(); // triggers refresh
  }

  refresh() {
    this.featuresetChanged.emit(); // triggers refresh
  }
}

