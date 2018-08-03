import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {AuthService} from '../../core/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
     
  public recoverFormGroup: FormGroup;
  public recoverObject: any = {email: ''}; 
  public sendRequest:Boolean = false;
  public wrongCredentials:Boolean = false;
  public successSent:Boolean = false;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.recoverFormGroup = new FormGroup({
      email: new FormControl(this.recoverObject.email, [
        Validators.required,
        Validators.email
      ])
    });
  }
  
  recoverYourAccount(form:FormGroup) {
    this.updateLoadBar();  
      this.resetMessages();
      this.authService.resetPassword(this.recoverFormGroup.value.email).then((message)=>{
        this.updateLoadBar();
        this.successSent = true; 
      }).catch((error) => {
         this.updateLoadBar();
         this.wrongCredentials = true;
      });
  }
  
  updateLoadBar(){
    this.sendRequest = !this.sendRequest;
  }
  
  resetMessages(){
     this.wrongCredentials = false;
     this.successSent = false; 
  }
 

}
