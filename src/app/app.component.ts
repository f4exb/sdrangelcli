import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SDRangelCli';
  sdrangelURL = "http://127.0.0.1:8888/sdrangel";
}
