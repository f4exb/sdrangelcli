import { Component, OnInit } from '@angular/core';
import { InstanceSummary } from './instance-summary';
import { InstanceSummaryService } from '../instance-summary.service';

@Component({
  selector: 'app-info',
  templateUrl: './instance-summary.component.html',
  styleUrls: ['./instance-summary.component.css']
})
export class InstanceSummaryComponent implements OnInit {

  instanceSummary: InstanceSummary = <InstanceSummary>{};

  constructor(private instanceSummaryService: InstanceSummaryService) { }

  ngOnInit() {
    this.fetchInstanceSummary();
  }

  private fetchInstanceSummary() {
    this.instanceSummaryService.getInfo().subscribe(instanceSummary => this.instanceSummary = instanceSummary);
  }

}
