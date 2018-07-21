import { Component, OnInit, Inject } from '@angular/core';
import { Logging, LOGGING_DEFAULT } from './logging';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SdrangelUrlService } from '../../sdrangel-url.service';

export interface LogLevel {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-logging-dialog',
  templateUrl: './logging-dialog.component.html',
  styleUrls: ['./logging-dialog.component.css']
})
export class LoggingDialogComponent implements OnInit {
  logLevels: LogLevel[] = [
    {value: "debug", viewValue: "Debug"},
    {value: "info", viewValue: "Info"},
    {value: "warning", viewValue: "Warning"},
    {value: "error", viewValue: "Error"}
  ];
  sdrangelURL: string;
  title: string;
  logging: Logging = LOGGING_DEFAULT;

  constructor(private dialogRef: MatDialogRef<LoggingDialogComponent>,
    private sdrangelUrlService: SdrangelUrlService,
    @Inject(MAT_DIALOG_DATA) public data: any)
  {
      this.title = data.title;
  }

  ngOnInit() {
    this.sdrangelUrlService.currentUrlSource.subscribe(url => {
      this.sdrangelURL = url;
    });
  }

}
