import { Component, OnInit, HostListener } from '@angular/core';
import {AuthService, User} from '../../core/auth.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public user: any = {};
  public loggedUser: any = {};
  public donations: any[];
  public petitions: any[];
  public isMobile: Boolean;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.configureCards();
  }

  constructor( private authService: AuthService, private route: ActivatedRoute) {
    this.authService.getCurrentUser().then(user => {
      this.loggedUser = user;
    }).catch(error => console.error(error));
  }

  ngOnInit() {
    this.configureCards();
    let userId;
    this.route.params.subscribe( params => {
      userId = {uid: params.id};
      this.authService.getUser(userId).subscribe((response) => {
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

}
