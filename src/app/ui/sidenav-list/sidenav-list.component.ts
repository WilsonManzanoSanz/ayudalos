import { Component, OnInit } from '@angular/core';
import {SidenavService} from '../shared/sidenav.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {

  constructor(public sidenavService: SidenavService, private router: Router) { }

  ngOnInit() {
  }

  public goToPage(path) {
     this.sidenavService.toggle();
     this.router.navigateByUrl(path);
  }

}
