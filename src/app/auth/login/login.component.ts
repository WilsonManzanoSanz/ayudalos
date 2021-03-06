import { Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {ErrorStateMatcher} from '@angular/material/core';
import {AuthService} from '../../core/auth.service';
import {Router} from '@angular/router';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return (control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  public loginFormGroup: FormGroup;
  public matcher = new MyErrorStateMatcher();
  public loginObject: any = {email: '', password: ''};
  public sendRequest: Boolean = false;
  public wrongCredentials: Boolean = false;
  public messageError = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.loginFormGroup = new FormGroup({
      email: new FormControl(this.loginObject.email, [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl(this.loginObject.password, [
        Validators.required
      ])
    });
  }

  attemptToLogin(form: FormGroup) {
     if (form.valid) {
         this.updateLoadBar();
         this.cleanView();
         this.authService.emailLogin(this.loginFormGroup.value.email, this.loginFormGroup.value.password).then((user) => {
           this.updateLoadBar();
           this.goToHome();
       }).catch((error) => {
           this.updateLoadBar();
           this.wrongCredentials = true;
      });
     }
  }

  googleLogin() {
    console.log('google');
    this.authService.googleLogin().then((user) => {
         this.goToHome();
       }).catch((error) => {
          console.error(error);
      });
  }

  facebookLogin() {
    this.authService.facebookLogin().then((user) => {
        this.goToHome();
       }).catch((error) => {
          console.error(error);
      });
  }
  
  goToHome(){
    if(this.authService.getPreviousState()){
       this.router.navigateByUrl(this.authService.getPreviousState());
     } else {
        this.router.navigateByUrl('/');
    }
  }

  updateLoadBar() {
    this.sendRequest = !this.sendRequest;
  }

  cleanView() {
    this.wrongCredentials = false;
    this.messageError = '';
  }


}
