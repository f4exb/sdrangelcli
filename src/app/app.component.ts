import { Component } from '@angular/core';
import { SdrangelUrlService } from './sdrangel-url.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'SDRangelCli';
  version = '0.0.1';
  sdrangelURL = "http://127.0.0.1:8091/sdrangel"; // the default URL
  
  constructor(private sdrangelUrlService: SdrangelUrlService) {
  }

  validateURL() {
    this.sdrangelUrlService.changeURL(this.sdrangelURL);
  }
}
