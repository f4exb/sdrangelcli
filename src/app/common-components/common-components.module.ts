import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrequencyDialComponent } from './frequency-dial/frequency-dial.component';
import { FormsModule } from '@angular/forms';
import { MatSelectModule, MatOptionModule, MatTooltipModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    MatTooltipModule
  ],
  declarations: [FrequencyDialComponent],
  exports: [FrequencyDialComponent]
})
export class CommonComponentsModule { }
