import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { FeaturesetComponent } from './featureset/featureset.component';
import { FeatureComponent } from './feature/feature.component';
import { RemoveFeatureDialogComponent } from './remove-feature-dialog/remove-feature-dialog.component';
import { AddFeatureDialogComponent } from './add-feature-dialog/add-feature-dialog.component';
import { LoadFeaturePresetDialogComponent } from './load-feature-preset-dialog/load-feature-preset-dialog.component';
import { SaveFeaturePresetDialogComponent } from './save-feature-preset-dialog/save-feature-preset-dialog.component';
import { NewFeaturePresetDialogComponent } from './new-feature-preset-dialog/new-feature-preset-dialog.component';


@NgModule({
  declarations: [
    FeaturesetComponent,
    FeatureComponent,
    RemoveFeatureDialogComponent,
    AddFeatureDialogComponent,
    LoadFeaturePresetDialogComponent,
    SaveFeaturePresetDialogComponent,
    NewFeaturePresetDialogComponent
  ],
  imports: [
    CommonModule,
    MatCardModule,
    MatTooltipModule,
    MatDialogModule,
    MatOptionModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatDividerModule,
    FormsModule
  ],
  entryComponents: [
    AddFeatureDialogComponent,
    RemoveFeatureDialogComponent,
    LoadFeaturePresetDialogComponent,
    SaveFeaturePresetDialogComponent,
    NewFeaturePresetDialogComponent
  ],
  exports: [
    FeaturesetComponent
  ]
})
export class FeaturesetModule { }
