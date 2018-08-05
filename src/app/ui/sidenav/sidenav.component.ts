import {Component, OnInit, ViewChild, HostListener, ChangeDetectorRef} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {MatSidenav} from '@angular/material';
import {SidenavService} from '../shared/sidenav.service';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {

// This events read the widht of the screen
 @ViewChild('sidenav') public sidenav: MatSidenav;
 @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.configureSideNav();
  }

  public mobileQuery: MediaQueryList;

  constructor(public sidenavService: SidenavService, changeDetectorRef: ChangeDetectorRef, media: MediaMatcher) {
    // Get with of the screen
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
  }

  ngOnInit(): void {
    this.sidenavService.setSidenav(this.sidenav);
    this.configureSideNav();
  }

  configureSideNav() {
    if (window.matchMedia('(max-width: 600px)').matches) {
      this.sidenav.close();
      this.sidenav.mode = 'over';
    } else {
      this.sidenav.open();
      this.sidenav.mode = 'side';
    }
  }

  public scrollHandler($event) {
    console.log($event);
    // should log top or bottom
  }

}
