import { Component, OnInit, HostListener } from '@angular/core';
import {AuthService, User} from '../../core/auth.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public user: User;
  public donations: any[];
  public petitions: any[];
  public isMobile: Boolean;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.configureCards();
  }

  constructor( private authService: AuthService, private route: ActivatedRoute) {
    this.user = this.authService.getCurrentlyUser();
  }

  ngOnInit() {
    this.configureCards();
    let userId;
    this.route.params.subscribe( params => {
      userId = {uid: params.id};
    });
    this.user = this.authService.getCurrentlyUser();
  }

   configureCards() {
    this.isMobile = window.matchMedia('(max-width: 900px)').matches;
  }

}
