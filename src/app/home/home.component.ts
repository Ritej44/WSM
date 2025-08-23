import { Component,OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
 
  constructor(){}

  ngOnInit():void{

  }

    imageSrc: string ='assets/logo__2_-removebg-preview.png';
    imageSr: string='assets/photo.jpg';
    image: string='assets/Experiences.png';
    imagSRC1 :string='assets/1.jpg'
    imagSRC2 :string='assets/2.jpg'
    imagSRC3 :string='assets/3.jpg'
    imagSRC4 :string='assets/4.jpg'
    
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



