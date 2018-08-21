import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../core/auth.service';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators, AbstractControl, ValidatorFn} from '@angular/forms';
import {PasswordValidator} from '../class/PasswordValidation';
import {MatSnackBar} from '@angular/material';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';


@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.css']
})
export class MyprofileComponent implements OnInit {

  public user: any = {};
  // Ng Model
  public passwordFormGroup: FormGroup;
  public passwordObject: any = { oldpassword: '', password: '', password2: ''};
  public passwordValidator = new PasswordValidator();

  // Views
  public sendRequest: Boolean = false;
  public edit_profile: Boolean = false;
  public edit_password: Boolean = true;
  public edit_password_allowed: Boolean = false;
  public wrongCredentials: Boolean = false;
  // Observable
  public photo: any;
  public downloadURL: string;

  constructor(private authService: AuthService, public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.user = this.authService.getCurrentlyUser();
    this.registerFormGroup();
  }

  registerFormGroup() {
    this.passwordFormGroup = new FormGroup({
       oldpassword: new FormControl(this.passwordObject.oldpassword, [
          Validators.required,
        ]),
        password: new FormControl(this.passwordObject.password, [
          Validators.required,
          Validators.minLength(6)
        ]),
        password2: new FormControl(this.passwordObject.password2 , [
          Validators.required,
          this.passwordValidator.validate
        ])
    });
  }

  saveChanges(nameForm: NgForm) {
    if (nameForm.valid) {
       const displayName = nameForm.value.displayName;
       // If can get the percent in the subscribe funciton
       if (Boolean(this.photo)) {
         this.updateLoadBar();
         this.authService.uploadPhofilePhoto(this.user.uid,this.photo).snapshotChanges().pipe(
          finalize(() => {
            this.authService.fileRef.getDownloadURL().subscribe((response) => {
              const user = {
                displayName: displayName,
                photoURL: response,
                uid: this.user.uid,
                email: this.user.email,
              };
              this.updateUser(user);
            });
          })
        ).subscribe();
       } else {
         const user = {
          displayName: displayName,
          uid: this.user.uid,
          email: this.user.email,
        };
        this.updateLoadBar();
        this.updateUser(user);
       }
    }
  }
  
  public updateUser(user:any) {
    this.authService.updateUser(user).subscribe((response) => {
         this.updateLoadBar();
         this.editProfile();
         this.updateInfo();
         this.authService.setUser(response['response']);
         this.user = response['response'];
      },(error)=>{
      console.error(error);
        this.updateLoadBar();
    });
  }

  changeFullName(nameForm: NgForm) {
  
    if (nameForm.valid) {
     const user = {
      displayName: nameForm.value,
      photoURL: this.user.photoURL,
      uid: this.user.uid,
      email: this.user.email,
    };
    this.updateUser(user);
    }
  }

  attemptToChangePassword(passwordForm: NgForm) {
     if (passwordForm.valid) {
        this.updateLoadBar();
        this.wrongCredentials = false;
        this.authService.emailLogin(this.user.email, passwordForm.value.oldpassword).then((user) => {
          this.authService.updatePassword(passwordForm.value.password).then((user) => {
            this.updateLoadBar();
            this.editPasswordView();
            this.updateInfo();
          }).catch((error) => {
            console.log(error);
            this.updateLoadBar();
          });
       }).catch((error) => {
         this.updateLoadBar();
         this.wrongCredentials = true;
      });
    }
  }

  inputPhoto() {
    document.getElementById('fileToUpload').click();
    const fileInput = document.getElementById('fileToUpload');
    fileInput.addEventListener('change', (e: any) => this.saveFile(e.target.files[0]));
  }

  saveFile(file) {
    this.photo = file;
  }

  editProfile() {
    this.edit_profile = !this.edit_profile;
  }

  editPasswordView() {
    this.edit_password = !this.edit_password;
  }

  updateLoadBar() {
    this.sendRequest = !this.sendRequest;
  }

  updateInfo() {
     this.snackBar.open('Your user has been updated', 'OK', {
      duration: 2000,
    });
  }


}
