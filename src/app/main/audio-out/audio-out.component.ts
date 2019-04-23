import { Component, OnInit } from '@angular/core';
import { AudioService } from '../audio/audio.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';
import { AudioDevices, AUDIO_DEVICES_DEFAULT } from '../audio/audio';

@Component({
  selector: 'app-audio-out',
  templateUrl: './audio-out.component.html',
  styleUrls: ['./audio-out.component.css']
})
export class AudioOutComponent implements OnInit {
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
