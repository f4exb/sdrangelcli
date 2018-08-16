import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrequencyDialComponent } from './frequency-dial/frequency-dial.component';
import { FormsModule } from '@angular/forms';
import { MatSelectModule, MatOptionModule, MatTooltipModule, MatProgressBarModule } from '@angular/material';
import { BufferGaugeComponent } from './buffer-gauge/buffer-gauge.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatSelectModule,
    MatOptionModule,
    MatProgressBarModule,
    MatTooltipModule
  ],
  declarations: [FrequencyDialComponent, BufferGaugeComponent],
  exports: [
    FrequencyDialComponent,
    BufferGaugeComponent
  ]
})
export class CommonComponentsModule { }
