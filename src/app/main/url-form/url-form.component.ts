import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-url-form',
  templateUrl: './url-form.component.html',
  styleUrls: ['./url-form.component.css']
})
export class UrlFormComponent implements OnInit {

  @Input() sdrangelURL: string;

  constructor() { }

  ngOnInit() {
    if (!this.sdrangelURL) {
      this.reset();
    }
  }

  reset() {
    this.sdrangelURL = "http://127.0.0.1:8091/sdrangel";
  }
}
