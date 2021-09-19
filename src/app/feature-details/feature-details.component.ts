import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SdrangelUrlService } from 'src/app/sdrangel-url.service';
import { FeatureDetailsService } from './feature-details.service';

@Component({
  selector: 'app-feature-details',
  templateUrl: './feature-details.component.html',
  styleUrls: ['./feature-details.component.css']
})
export class FeatureDetailsComponent implements OnInit {
  featuresetIndex: number;
  featureIndex: number;
  private sub: Subscription;
  sdrangelURL: string;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private featuredetailsService: FeatureDetailsService,
    private sdrangelUrlService: SdrangelUrlService) {
      this.sub = null;
  }

  ngOnInit(): void {
    this.sub = this.route.params.subscribe(params => {
      this.featuresetIndex = +params['dix']; // (+) converts string 'dix' to a number
      this.featureIndex = +params['cix']; // (+) converts string 'cix' to a number
    });
    this.sdrangelUrlService.currentUrlSource.subscribe(url => {
      this.sdrangelURL = url;
      this.getFeatureSettings();
    });
  }

  getFeatureSettings() {
    this.featuredetailsService.getSettings(this.sdrangelURL, this.featuresetIndex, this.featureIndex).subscribe(
      featureSettings => {
        if (featureSettings.featureType === 'AIS') {
          this.router.navigate(['ais'], {relativeTo: this.route});
        } else {
          this.router.navigate(['notsupported'], { relativeTo: this.route});
        }
      }
    );
  }

  getFeaturesetLabel(): string {
    return 'F' + this.featuresetIndex;
  }
}
