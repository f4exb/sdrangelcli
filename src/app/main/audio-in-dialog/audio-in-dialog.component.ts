import { Component, OnInit, Inject } from '@angular/core';
import { AudioInputDevice } from '../audio/audio';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { AudioService } from '../audio/audio.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';

@Component({
  selector: 'app-audio-in-dialog',
  templateUrl: './audio-in-dialog.component.html',
  styleUrls: ['./audio-in-dialog.component.css']
})
export class AudioInDialogComponent implements OnInit {
  sdrangelURL: string;
  audioDevice : AudioInputDevice;

  constructor(private dialogRef: MatDialogRef<AudioInDialogComponent>,
    private audioService: AudioService,
    private sdrangelUrlService: SdrangelUrlService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public snackBar: MatSnackBar)
  {
    this.audioDevice = data.audioDevice;
  }

  ngOnInit() {
    this.sdrangelUrlService.currentUrlSource.subscribe(url => {
      this.sdrangelURL = url;
    });
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.audioService.updateAudioInput(this.sdrangelURL + "/audio/output/parameters", this.audioDevice).subscribe(
      res => {
        console.log("Update OK", res);
      },
      err => {
        this.snackBar.open(err.error.message, "OK", {duration: 2000});
      }
    );
    this.dialogRef.close();
  }
}
