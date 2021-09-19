import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FeaturePresetGroup } from '../featurepreset/featurepreset';

@Component({
  selector: 'app-featurepreset-group',
  templateUrl: './featurepreset-group.component.html',
  styleUrls: ['./featurepreset-group.component.css']
})

export class FeaturepresetGroupComponent implements OnInit {
  @Input() presetGroup: FeaturePresetGroup;
  @Output() presetGroupChanged = new EventEmitter();
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

  presetRemoved() {
    this.presetGroupChanged.emit(); // triggers refresh
  }

  refresh() {
    this.presetGroupChanged.emit(); // triggers refresh
  }
}
