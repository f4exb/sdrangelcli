import { Component, OnInit } from '@angular/core';
import { Presets, PRESETS_DEFAULT } from '../preset/preset';
import { PresetService } from '../preset/preset.service';
import { SdrangelUrlService } from '../../sdrangel-url.service';

@Component({
  selector: 'app-presets',
  templateUrl: './presets.component.html',
  styleUrls: ['./presets.component.css']
})
export class PresetsComponent implements OnInit {
  sdrangelURL : string;
  presets : Presets = PRESETS_DEFAULT;
  statusMessage : string;
  statusError : boolean;

  constructor(private presetService: PresetService,
    private sdrangelUrlService: SdrangelUrlService) {
  }

  ngOnInit() {
    this.sdrangelUrlService.currentUrlSource.subscribe(url => {
      this.sdrangelURL = url;
      this.fetchPresetsInformation();
    })
  }

  private fetchPresetsInformation() {
    this.presetService.getInfo(this.sdrangelURL + "/presets").subscribe(
      presets => {
        this.presets = presets;
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
