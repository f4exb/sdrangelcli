import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FrequencyDialComponent } from './frequency-dial/frequency-dial.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [FrequencyDialComponent],
  exports: [FrequencyDialComponent]
})
export class CommonComponentsModule { }
