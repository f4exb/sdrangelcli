import { Component, OnInit, Input } from '@angular/core';
import { InstanceSummary } from './instance-summary';
import { InstanceSummaryService } from '../instance-summary.service';

@Component({
  selector: 'app-instance-summary',
  templateUrl: './instance-summary.component.html',
  styleUrls: ['./instance-summary.component.css']
})
export class InstanceSummaryComponent implements OnInit {

  @Input() sdrangelURL: string;
  instanceSummary: InstanceSummary = <InstanceSummary>{};

  constructor(private instanceSummaryService: InstanceSummaryService) { }

  ngOnInit() {
    this.sdrangelURL = "http://127.0.0.1:8091/sdrangel";
    this.fetchInstanceSummary();
  }

  private fetchInstanceSummary() {
    this.instanceSummaryService.getInfo(this.sdrangelURL).subscribe(instanceSummary => this.instanceSummary = instanceSummary);
  }

}
