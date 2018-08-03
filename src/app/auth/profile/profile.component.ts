import { Component, OnInit, HostListener } from '@angular/core';
import {AuthService, User} from '../../core/auth.service';
import { PostsService, Post } from '../../posts/shared/posts.service';
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public user:User;
  public donations:Post[];
  public petitions:Post[];
  public isMobile:Boolean;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.configureCards();
  } 

  constructor(public donationService:PostsService, private authService:AuthService, private route: ActivatedRoute) { 
    this.user = this.authService.getCurrentlyUser();
  }

  ngOnInit() {
    this.configureCards();
    let userId;
    this.route.params.subscribe( params => {
      userId ={uid: params.id}; 
    });
    this.user = this.authService.getCurrentlyUser();
    this.donationService.getDonationsByUser(userId).subscribe(response=>{
      this.donations = response;
    });
     this.donationService.getPetitionsByUser(userId).subscribe(response=>{
      this.petitions = response;
    });
  }

   configureCards(){
    if(window.matchMedia('(max-width: 900px)').matches){
      this.isMobile = true;
    }else{
      this.isMobile = false;
    }
  }

}