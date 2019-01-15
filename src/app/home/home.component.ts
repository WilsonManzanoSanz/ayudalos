import { Component, OnInit } from '@angular/core';
//import Flickity from 'flickity';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  //flkty: any;
  public slideIndex = 1;
  
  constructor() {
  }

  ngOnInit() {
    this.showSlides(this.slideIndex);
    this.timeout();
    /* this.flkty = new Flickity( '.carousel', {
      // options
      wrapAround: true,
      contain: true,
      autoPlay: false,
    });*/
  }
  
  timeout() {
    setTimeout(() => {
        this.plusSlides(1);
        this.timeout();
    }, 6000);
}
  
  plusSlides(n) {
    this.showSlides(this.slideIndex += n);
  }

  currentSlide(n) {
    this.showSlides(this.slideIndex = n);
  }

  showSlides(n) {
    let i;
    let slides:any = document.getElementsByClassName("mySlides");
    let dots:any = document.getElementsByClassName("dot");
    if (n > slides.length) {this.slideIndex = 1}    
    if (n < 1) {this.slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[this.slideIndex-1].style.display = "block";  
    dots[this.slideIndex-1].className += " active";
  }
}
