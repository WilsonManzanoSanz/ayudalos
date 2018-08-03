import { Component, OnInit } from '@angular/core';
import {NgForm} from '@angular/forms';
import {AboutService, Collaborator} from '../core/about.service';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.css']
})
export class AboutusComponent implements OnInit {
  // TODO get people from the server
  public contact:any = {};
  public collaborators:Collaborator[];
  constructor(private aboutService:AboutService) {
  }

  ngOnInit() {
    this.getCollaborators();
  }

  public getCollaborators(){
    this.aboutService.getCollaborators().subscribe(response=>{
      this.collaborators = response;
    });
  }

  public submitForm(form){
    console.log(form);
  }

}