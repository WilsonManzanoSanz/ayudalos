import { Component, OnInit } from '@angular/core';
import {AuthService, User} from '../../core/auth.service';
import {PetitionsService} from '../shared/petitions.service';
import {ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-petition',
  templateUrl: './petition.component.html',
  styleUrls: ['./petition.component.css']
})
export class PetitionComponent implements OnInit {
  
  public petitions: any[] = [];
  public notFound: Boolean = false;
  public user: any = {};

  constructor(public petitionService: PetitionsService, private authService: AuthService,  private route: ActivatedRoute) { }

  ngOnInit() {
    this.initializeUser();
  }
  
  public initializeUser() {
    this.authService.getCurrentUser().then((user) => {
      this.user = user;
      this.getPetition();
    }).catch(error => console.error(error));
  }
  
  public getPetition() {
    this.route.params.subscribe( 
      params => {
        this.petitionService.getPetition(params.id).subscribe(response => {
          if(response.data){
             this.petitions.push(response.data);
          } else {
            this.notFound = true;
          }
        }, error => console.error(error));
      },
      error => console.error(error)
    );
  }

}
