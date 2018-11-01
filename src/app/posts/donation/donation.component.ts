import { Component, OnInit } from '@angular/core';
import {AuthService, User} from '../../core/auth.service';
import {PostsService} from '../shared/posts.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-donation',
  templateUrl: './donation.component.html',
  styleUrls: ['./donation.component.css']
})
export class DonationComponent implements OnInit {
  
  public posts: any[] = [];
  public notFound: Boolean = false;
  public user: any = {};

  constructor(public donationService: PostsService, private authService: AuthService,  private route: ActivatedRoute) { }

  ngOnInit() {
    this.initializeUser();
    //this.getDonation();
  }
  
  public initializeUser() {
    this.authService.getCurrentUser().then((user) => {
      this.user = user;
      this.getDonation();
    }).catch(error => console.error(error));
  }
  
  public getDonation() {
    this.route.params.subscribe( 
      params => {
        this.donationService.getDonation(params.id).subscribe(response => {
          if(response.data){
             this.posts.push(response.data);
          } else {
            this.notFound = true;
          }
        }, error => console.error(error));
      },
      error => console.error(error)
    );
  }

}
