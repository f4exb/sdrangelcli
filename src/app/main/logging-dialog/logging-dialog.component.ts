import { Component, OnInit, Inject } from '@angular/core';
import { Logging, LOGGING_DEFAULT } from './logging';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { LoggingService } from './logging.service';

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
  logToFile: boolean;

  constructor(private dialogRef: MatDialogRef<LoggingDialogComponent>,
    private loggingService: LoggingService,
    private sdrangelUrlService: SdrangelUrlService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar: MatSnackBar)
  {
      this.title = data.title;
  }

  ngOnInit() {
    this.sdrangelUrlService.currentUrlSource.subscribe(url => {
      this.sdrangelURL = url;
      this.get();
    });
  }

  get() {
    this.loggingService.get(this.sdrangelURL + "/logging").subscribe( logging => {
      this.logging = logging;
      this.logToFile = logging.dumpToFile !== 0;
    });
  }

  setLogToFile() {
    this.logging.dumpToFile = this.logToFile ? 1 : 0;
  }

  save() {
    if (this.logging.dumpToFile === 0) {
      if (this.logging.fileLevel) {
        delete this.logging.fileLevel;
      }
      if (this.logging.fileName) {
        delete this.logging.fileName;
      }
    }
    this.loggingService.put(this.sdrangelURL + "/logging", this.logging).subscribe (
      res => {
        console.log("PUT OK", res);
      },
      err => {
        this.snackBar.open(err.error.message, "OK", {duration: 2000});
      }
    )
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }
}
