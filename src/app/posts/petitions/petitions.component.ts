import { Component, OnInit , HostListener } from '@angular/core';
import {AuthService, User} from '../../core/auth.service';
import {PetitionsService, Petition} from '../shared/petitions.service';
import {HttpParams} from '@angular/common/http';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'app-petitions',
  templateUrl: './petitions.component.html',
  styleUrls: ['./petitions.component.css'],
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
export class PetitionsComponent implements OnInit {

  public petitionsColumn1: any[] = [];
  public petitionsColumn2: any[] = [];
  public user: any = {};
  public isMobile: Boolean;
  public sendRequest: Boolean;
  public stateSearchBar = 'inactive';
  public searchQuery: string;
  public globalPetitions: any[] = [];
  public skip  = 10;
  public petition = {};
  

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.configureCards();
  }

  constructor(public petitionService: PetitionsService, private authService: AuthService) {
    this.initializeUser();
  }

  ngOnInit() {
    this.configureCards();
    
  }

  public initializeUser() {
    this.authService.getCurrentUser().then((user) => {
      this.user = user;
      this.getPetitionContent();
    }).catch(error => console.error(error));
  }

  toggleSearchState() {
    this.stateSearchBar = this.stateSearchBar === 'active' ? 'inactive' : 'active';
  } 

  public getPetitionContent() {
    this.petitionService.addParamaters([{key:'skip', value:0}]);
    this.petitionService.getPetitions().subscribe(response => {
        this.addNewPetitions(response.data.items);
    });
  }
  
  updatesBySearch(newArray: any[]){
    this.cleanArrays();
    this.addNewPetitions(newArray); 
  }
  
  cleanArrays(){
    this.petitionsColumn1 = [];
    this.petitionsColumn2 = [];
    this.globalPetitions = [];
  }

  addNewPetitions(newArray: any[], newElement = false) {
    if (newArray.length > 0) {
        if (this.isMobile) {
           this.petitionsColumn1 = (newElement) ? [ ...newArray, ...this.petitionsColumn1 ]: [ ...this.petitionsColumn1, ... newArray];
          this.petitionsColumn1 = this.petitionsColumn1.map(value => {
            if(this.user.uid === value.user.uid){
                value.allowedDelete = true;
            }
            return value;
          });
          return newArray;
        } else {
            this.globalPetitions = this.petitionService.separateIntoTwoArrays(
                this.globalPetitions, newArray, this.petitionsColumn1, this.petitionsColumn2, this.user.uid, newElement);
        }
    }
  }

  refreshPetitions(newPost) {
    const newArray: any[] = [];
    newArray.push(newPost, );
    this.addNewPetitions(newArray, true);
  }

  public getMore(startFrom) {
    this.updateLoadBar();
    this.petitionService.addParamaters([{key:'skip', value:this.skip.toString()}]);
    this.petitionService.getPetitions().subscribe((response) => {
      this.skip = this.skip + 10;
      this.updateLoadBar();
      this.addNewPetitions(response.data.items);
    }, (error) => console.error(error));
  }

  public clearSearchForm() {
    this.cleanArrays();
    this.getPetitionContent();
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
