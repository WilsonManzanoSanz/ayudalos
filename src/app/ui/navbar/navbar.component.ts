import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {SidenavService} from '../shared/sidenav.service';
import {MatSidenav} from '@angular/material';
import {AuthService, User} from '../../core/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  public isMobile: Boolean = false;
  public user:any;
  public navs:any;

  @ViewChild('navbar') public sidenav: MatSidenav;
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.configureNavBar(event);
  } 

  constructor(public sidenavService: SidenavService, public authService:AuthService, private router:Router) {
    this.navs = sidenavService.getNavItems();
  }

  ngOnInit() {
    this.configureNavBar(null);
    
  }

  configureNavBar(event) {
    this.isMobile = window.matchMedia('(max-width: 600px)').matches;
  }
  
  signOut(){
    this.authService.signOut();
    this.router.navigateByUrl('/');      
  }

}
