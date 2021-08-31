import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AddFeatureDialogComponent } from '../add-feature-dialog/add-feature-dialog.component';
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
   return 'F' + this.featureSet.index;
  }

  openAddFeatureDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      featureSetIndex: this.featureSet.index
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
    const dialogRef = this.popupDialog.open(AddFeatureDialogComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'OK') {
        this.featuresetChanged.emit(); // triggers refresh
      }
    });
  }
}

