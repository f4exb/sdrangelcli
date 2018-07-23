import { Component, OnInit, Inject } from '@angular/core';
import { AudioOutputDevice } from '../audio/audio';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { AudioService } from '../audio/audio.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';

export interface ChannelMode {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-audio-out-dialog',
  templateUrl: './audio-out-dialog.component.html',
  styleUrls: ['./audio-out-dialog.component.css']
})
export class AudioOutDialogComponent implements OnInit {
  channelModes: ChannelMode[] = [
    {value: 0, viewValue: "Left"},
    {value: 1, viewValue: "Right"},
    {value: 2, viewValue: "Mixed"},
    {value: 3, viewValue: "Stereo"}
  ];  
  sdrangelURL: string;
  audioDevice : AudioOutputDevice;
  copyToUDP: boolean;
  udpUsesRTP: boolean;

  constructor(private dialogRef: MatDialogRef<AudioOutDialogComponent>,
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

  setCopyToUDP() {
    this.audioDevice.copyToUDP = this.copyToUDP ? 1 : 0;
  }

  setUDPUsesRTP() {
    this.audioDevice.udpUsesRTP = this.udpUsesRTP ? 1 : 0;
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    this.audioService.updateAudioOutput(this.sdrangelURL + "/audio/output/parameters", this.audioDevice).subscribe(
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
