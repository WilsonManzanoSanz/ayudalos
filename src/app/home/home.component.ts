import { Component, OnInit, OnDestroy } from '@angular/core';
//import Flickity from 'flickity';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  //flkty: any;
  public slideIndex = 1;
  public slides:any = document.getElementsByClassName("mySlides");
  public dots:any = document.getElementsByClassName("dot");
  
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


  ngOnDestroy(){
    
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
    if(document.getElementsByClassName("mySlides")[1]){
      let i;
      this.slideIndex = (n > this.slides.length) ? 1 : this.slideIndex = this.slides.length;
      for (i = 0; i < this.slides.length; i++) {
          this.slides[i].style.display = "none";  
      }
      for (i = 0; i < this.dots.length; i++) {
          this.dots[i].className = this.dots[i].className.replace(" active", "");
      }
      this.slides[this.slideIndex-1].style.display = "block";  
      this.dots[this.slideIndex-1].className += " active";
      }
  }
}
