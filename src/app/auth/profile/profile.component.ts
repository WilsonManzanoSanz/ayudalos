import { Component, OnInit, HostListener } from '@angular/core';
import {AuthService, User} from '../../core/auth.service';
import {ActivatedRoute} from '@angular/router';
import {HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public user: any = {};
  public userId: any;
  public loggedUser: any = {};
  public donations: any[];
  public petitions: any[];
  public isMobile: Boolean;
  public skip: number = 0;
  public scrollPostsDiv: any;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.configureCards();
  }

  constructor( private authService: AuthService, private route: ActivatedRoute) {
    this.scrollPostsDiv = document.getElementById('scrollPostsDiv');
    this.authService.getCurrentUser().then(user => {
      this.loggedUser = user;
    }).catch(error => console.error(error));
  }

  ngOnInit() {
    this.configureCards();
    this.route.params.subscribe( params => {
      this.userId = {uid: params.id};
      this.authService.getUser(this.userId).subscribe((response) => {
        this.user = response.data;
        this.user.posts = response.data.posts.map((value) => {
          let newValue = value;
          newValue.user = this.user;
          return newValue;
        });
      });
    });
  }

   configureCards() {
    this.isMobile = window.matchMedia('(max-width: 900px)').matches;
  }
  
  onScroll(){
    console.log('scroll');
    this.authService.getUser(this.userId, new HttpParams().set('skip', this.skip.toString()).set('limit', '10')).subscribe((response) => {
        this.user = response.data;
        this.skip = this.skip + 10;
        this.user.posts = response.data.posts.map((value) => {
          let newValue = value;
          newValue.user = this.user;
          return newValue;
        });
    });
  }

}
