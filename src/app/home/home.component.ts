import { Component, OnInit } from '@angular/core';
import Flickity from 'flickity'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  flkty:any;

  constructor() {
  }

  ngOnInit(){
     this.flkty = new Flickity( '.carousel', {
      // options
      wrapAround:true,
      contain: true,
      autoPlay:false,
    });

  }
}