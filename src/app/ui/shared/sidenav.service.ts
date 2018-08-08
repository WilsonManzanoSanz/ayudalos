import { Injectable } from '@angular/core';
import { MatSidenav } from '@angular/material';
/* Interface of every Nav item*/
export interface NavItem {
  name: string;
  path: string;
  icon: string;
}

@Injectable()
export class SidenavService {

  private sidenav: MatSidenav;
  private navItems: Array<NavItem> = [
    {name: 'CONOCENOS', path: '/aboutus', icon: 'info'},
    {name: 'DONACIONES', path: '/posts/donations/home', icon: 'favorite'},
    {name: 'PETICIONES', path: '/posts/petitions/home', icon: 'filter_vintage'},
  ];
  /* Initialize sideNav 'Pass the object reference' */
  public setSidenav(sidenav: MatSidenav) {
    this.sidenav = sidenav;
  }

  public open() {
    return this.sidenav.open();
  }

  public close() {
    return this.sidenav.close();
  }
  /* Switch the state open/close */
  public toggle(): void {
    this.sidenav.toggle();
  }

  public getNavItems() {
    return this.navItems;
  }

  public hideNav() {
     document.getElementById('main-toolbar').style.visibility = 'hidden';
  }

  public showNav() {
     document.getElementById('main-toolbar').style.visibility = 'visible';
  }

}
