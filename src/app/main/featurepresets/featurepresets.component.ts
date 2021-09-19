import { Component, OnInit } from '@angular/core';
import { SdrangelUrlService } from 'src/app/sdrangel-url.service';
import { FeaturePresets, FEATURE_PRESETS_DEFAULT } from '../featurepreset/featurepreset';
import { FeaturepresetService } from '../featurepreset/featurepreset.service';

@Component({
  selector: 'app-featurepresets',
  templateUrl: './featurepresets.component.html',
  styleUrls: ['./featurepresets.component.css']
})
export class FeaturepresetsComponent implements OnInit {
  sdrangelURL: string;
  presets: FeaturePresets = FEATURE_PRESETS_DEFAULT;
  statusMessage: string;
  statusError: boolean;

  constructor(private presetService: FeaturepresetService,
    private sdrangelUrlService: SdrangelUrlService) {
  }

  ngOnInit(): void {
    this.sdrangelUrlService.currentUrlSource.subscribe(url => {
      this.sdrangelURL = url;
      this.fetchPresetsInformation();
    });
  }

  fetchPresetsInformation() {
    this.presetService.getInfo(this.sdrangelURL).subscribe(
      presets => {
        this.presets = presets;
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
