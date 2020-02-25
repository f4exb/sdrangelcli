import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrequencyDialComponent } from './frequency-dial/frequency-dial.component';
import { FormsModule } from '@angular/forms';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
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
