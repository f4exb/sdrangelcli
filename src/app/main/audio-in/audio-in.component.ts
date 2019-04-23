import { Component, OnInit } from '@angular/core';
import { AudioDevices, AUDIO_DEVICES_DEFAULT } from '../audio/audio';
import { AudioService } from '../audio/audio.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';

@Component({
  selector: 'app-audio-in',
  templateUrl: './audio-in.component.html',
  styleUrls: ['./audio-in.component.css']
})
export class AudioInComponent implements OnInit {
  sdrangelURL: string;
  audioDevicesInfo: AudioDevices = AUDIO_DEVICES_DEFAULT;
  statusMessage: string;
  statusError: boolean;

  constructor(private audioService: AudioService,
    private sdrangelUrlService: SdrangelUrlService) {
  }

  ngOnInit() {
    this.sdrangelUrlService.currentUrlSource.subscribe(url => {
      this.sdrangelURL = url;
      this.fetchAudioInformation();
    });
  }

  fetchAudioInformation() {
    this.audioService.getInfo(this.sdrangelURL + '/audio').subscribe(
      audioDevicesInfo => {
        this.audioDevicesInfo = audioDevicesInfo;
        this.statusMessage = 'OK';
        this.statusError = false;
      },
      error => {
        this.statusMessage = error.message;
        this.statusError = true;
      }
    );
  }
}
