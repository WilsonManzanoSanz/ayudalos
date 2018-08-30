import { Component, OnInit , HostListener } from '@angular/core';
import {AuthService, User} from '../../core/auth.service';
import {PostsService} from '../shared/posts.service';
import {HttpParams} from '@angular/common/http';
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
  public user: any = {};
  public isMobile: Boolean;
  public sendRequest: Boolean = false;
  public stateSearchBar = 'inactive';
  public searchQuery: string;
  public globalPosts: any[] = [];
  public skip  = 10;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.configureCards();
  }

  constructor(public donationService: PostsService, private authService: AuthService) {
    this.initializeUser();
  }

  ngOnInit() {
    this.configureCards();
    this.getDonationContent();
  }

  public initializeUser() {
      if (this.authService.getCurrentlyUser()) {
          this.user = this.authService.getCurrentlyUser();
      } else {
          this.authService.hardLoadUser().subscribe(user => {
              if (user) {
                  this.authService.getUser(user).subscribe((responseUser) => {
                      this.user = responseUser.data;
                  }, error => console.error(error));
              }
          }, (error => console.error(error)));
      }
  }

  toggleSearchState() {
    this.stateSearchBar = this.stateSearchBar === 'active' ? 'inactive' : 'active';
  }

  public getDonationContent() {
    this.donationService.addParamaters([{key:'skip', value:0}]);
    this.donationService.getDonations().subscribe(response => {
        this.addNewPosts(response.data.items);
    });
  }
  
  updatesBySearch(newArray: any[]){
    this.cleanArrays();
    this.addNewPosts(newArray); 
  }
  
  cleanArrays(){
    this.donationsColumn1 = [];
    this.donationsColumn2 = [];
    this.globalPosts = [];
  }

  addNewPosts(newArray: any[]) {
    if (newArray.length > 0) {
        if (this.isMobile) {
          this.donationsColumn1 = [...this.donationsColumn1, ... newArray];
          return newArray;
        } else {
            this.globalPosts = this.donationService.separateIntoTwoArrays(
                this.globalPosts, newArray, this.donationsColumn1, this.donationsColumn2);
        }
    }
  }

  refreshPosts(newPost) {
    const newArray: any[] = [];
    newArray.push(newPost);
    this.addNewPosts(newArray);
  }

  public getMore(startFrom) {
    this.updateLoadBar();
    this.donationService.addParamaters([{key:'skip', value:this.skip.toString()}]);
    this.donationService.getDonations().subscribe((response) => {
      this.skip = this.skip + 10;
      this.updateLoadBar();
      this.addNewPosts(response.data.items);
    }, (error) => console.error(error));
  }

  public clearSearchForm() {
    this.cleanArrays();
    this.getDonationContent();
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
    this.getMore(10);
  }

  public updateLoadBar() {
    this.sendRequest = !this.sendRequest;
  }

}
