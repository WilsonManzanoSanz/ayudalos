import { Component, OnInit , HostListener } from '@angular/core';
import {AuthService, User} from '../../core/auth.service';
import {PostsService, Post} from '../shared/posts.service';

@Component({
  selector: 'app-petitions',
  templateUrl: './petitions.component.html',
  styleUrls: ['./petitions.component.css']
})
export class PetitionsComponent implements OnInit {

  public petitionsColumn1: any[] = [];
  public petitionsColumn2: any[] = [];
  public user: User;
  public isMobile: Boolean;
  public sendRequest: Boolean;

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.configureCards();
  }

  constructor(public petitionService: PostsService, private authService: AuthService) {
    this.user = this.authService.getCurrentlyUser();
  }

  public getPetitionContent() {
     this.petitionService.getPetitions().subscribe(response => {
      if (this.isMobile) {
        this.petitionsColumn1 = response;
        return response;
      }
      if (response.length > 0) {
        this.petitionsColumn1 = [];
        this.petitionsColumn2 = [];
        this.petitionService.separateIntoTwoArrays(response, this.petitionsColumn1, this.petitionsColumn2);
      }
    });
  }

  ngOnInit() {
    this.configureCards();
    this.getPetitionContent();
  }

  public getMore(startFrom) {
    this.updateLoadBar();
    this.petitionService.getDonations(startFrom).subscribe(response => {
      this.updateLoadBar();
      if (response.length > 0) {
        if (this.isMobile) {
          this.petitionsColumn1.push(response);
          return response;
        } else {
           this.petitionService.separateIntoTwoArrays(response, this.petitionsColumn1, this.petitionsColumn2);
        }
      }
    });
  }

  configureCards() {
    if (window.matchMedia('(max-width: 900px)').matches) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }

  public onScroll() {
    this.getMore(this.petitionService.getLastEntry());
  }

  updateLoadBar() {
    this.sendRequest = !this.sendRequest;
  }

}
