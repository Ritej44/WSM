import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  isHomeVisible = true;
  isAboutVisible = false;

  showAbout() {
    // Hide other components
    this.isHomeVisible = false;
    this.isAboutVisible = true;
  }

  showHome() {
    // Hide other components
    this.isHomeVisible = true;
    this.isAboutVisible = false;
  }
}
