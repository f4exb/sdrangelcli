import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SdrangelUrlService } from 'src/app/sdrangel-url.service';
import { Feature } from '../feature/feature';
import { RemoveFeatureService } from './remove-feature.service';

@Component({
  selector: 'app-remove-feature-dialog',
  templateUrl: './remove-feature-dialog.component.html',
  styleUrls: ['./remove-feature-dialog.component.css']
})
export class RemoveFeatureDialogComponent implements OnInit {
  sdrangelURL: string;
  feature: Feature;
  featureeSetIndex: number;
  featureIndex: number;

  constructor(private dialogRef: MatDialogRef<RemoveFeatureDialogComponent>,
    private removeChannelService: RemoveFeatureService,
    private sdrangelUrlService: SdrangelUrlService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

}
