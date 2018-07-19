import { Component, OnInit, Input } from '@angular/core';
import { InstanceSummary, INSTANCE_SUMMARY_DEFAULT } from './instance-summary';
import { InstanceSummaryService } from '../instance-summary.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';

@Component({
  selector: 'app-instance-summary',
  templateUrl: './instance-summary.component.html',
  styleUrls: ['./instance-summary.component.css']
})
export class InstanceSummaryComponent implements OnInit {

  @Input() sdrangelURL: string;
  instanceSummary: InstanceSummary = INSTANCE_SUMMARY_DEFAULT;
  statusMessage: string;
  statusError: boolean = false;

  constructor(private instanceSummaryService: InstanceSummaryService, 
    private sdrangelUrlService: SdrangelUrlService) { 
  }

  ngOnInit() {
    this.sdrangelUrlService.currentUrlSource.subscribe(url => {
      this.sdrangelURL = url;
      this.fetchInstanceSummary();
    });
  }

  private fetchInstanceSummary() {
    this.instanceSummaryService.getInfo(this.sdrangelURL).subscribe(
      instanceSummary => {
        this.instanceSummary = instanceSummary;
        this.statusMessage = "OK";
        this.statusError = false;
      },
      error => { 
        this.statusMessage = error.message;
        this.statusError = true;
      }
    );
  }

}
