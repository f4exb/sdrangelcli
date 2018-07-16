import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstanceSummaryComponent } from './instance-summary/instance-summary.component';
import { UrlFormComponent } from './url-form/url-form.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [InstanceSummaryComponent, UrlFormComponent]
})
export class MainModule { }
