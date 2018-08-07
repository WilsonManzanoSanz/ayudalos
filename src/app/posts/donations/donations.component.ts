import { Component, OnInit , HostListener, OnDestroy } from '@angular/core';
import {AuthService, User} from '../../core/auth.service';
import {PostsService} from '../shared/posts.service';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-donations',
  templateUrl: './donations.component.html',
  styleUrls: ['./donations.component.css'],
  animations: [
    trigger('searchBarState', [
      state('inactive', style({
        width: '0vw',
        padding: '0px'
      })),
      state('active',   style({
         width: '100%',
      })),
      transition('inactive => active', animate('500ms ease-in')),
      transition('active => inactive', animate('500ms ease-out'))
    ])
  ]
})
export class DonationsComponent implements OnInit {

  public donationsColumn1: any[] = [];
  public donationsColumn2: any[] = [];
  public user: User;
  public isMobile: Boolean;
  public sendRequest: Boolean = false;
  public stateSearchBar = 'inactive';
  public searchQuery: string;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.configureCards();
  }

  constructor(public donationService: PostsService, private authService: AuthService) {
    this.user = this.authService.getCurrentlyUser();
  }

  ngOnInit() {
    this.configureCards();
    this.getDonationContent();
  }

  toggleSearchState() {
    this.stateSearchBar = this.stateSearchBar === 'active' ? 'inactive' : 'active';
  }

  public getDonationContent() {
    this.donationService.getDonations().subscribe(response => {
      if (response.length > 0) {
        if (this.isMobile) {
          this.donationsColumn1 = response;
          return response;
        } else {
          this.donationsColumn1 = [];
          this.donationsColumn2 = [];
          this.donationService.separateIntoTwoArrays(response, this.donationsColumn1, this.donationsColumn2);
        }
      }
    });
  }

  public getMore(startFrom) {
    this.updateLoadBar();
    this.donationService.getDonations(startFrom).subscribe(response => {
      this.updateLoadBar();
      if (response.length > 0) {
        if (this.isMobile) {
          this.donationsColumn1.push(response);
          return response;
        } else {
           this.donationService.separateIntoTwoArrays(response, this.donationsColumn1, this.donationsColumn2);
        }
      }
    });
  }

  public clearSearchForm() {
    this.toggleSearchState();
  }

  configureCards() {
    if (window.matchMedia('(max-width: 900px)').matches) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }

  public onScroll() {
    this.getMore(this.donationService.getLastEntry());
  }

  public updateLoadBar() {
    this.sendRequest = !this.sendRequest;
  }
  
  ngOnDestroy(){
    console.log('Destroyed');
  }

}
