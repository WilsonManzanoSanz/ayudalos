import { Component, OnInit, HostListener } from '@angular/core';
import {AuthService, User} from '../../core/auth.service';
import {ActivatedRoute} from '@angular/router';
import {HttpParams} from '@angular/common/http';
import {FormControl, FormGroup, FormGroupDirective, NgForm, Validators, AbstractControl, ValidatorFn} from '@angular/forms';
import {PasswordValidator} from '../class/PasswordValidation';
import {MatSnackBar} from '@angular/material';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public user: any = {};
  public userId: any;
  public loggedUser: any = {};
  public donations: any[];
  public petitions: any[];
  public skip: number = 0;
  
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
  public isMobile: Boolean;
  public sameUserLogged: Boolean = false;
  // Observable
  public photo: any;
  public downloadURL: string;


  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.configureCards();
  }

  constructor( private authService: AuthService, private route: ActivatedRoute, public snackBar: MatSnackBar) {
    this.authService.getCurrentUser().then(user => {
      this.loggedUser = user;
    }).catch(error => console.error(error));
  }

  ngOnInit() {
    this.configureCards();
    this.route.params.subscribe( params => {
      this.userId = {uid: params.id};
      this.authService.getUser(this.userId).subscribe((response) => {
        if(params.id === this.loggedUser.uid){
          this.sameUserLogged = true;
        }
        this.user = response.data;
        this.skip = this.skip + 10;
        this.reformatPosts(response.data.posts, false);
      });
    });
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
    this.skip 
    this.authService.updateUser(user).subscribe((response) => {
         this.updateLoadBar();
         this.editProfile();
         this.updateInfo();
         this.user = response.data;
         this.reformatPosts(response.data.posts, false);
         this.authService.setUser(response.data);
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

  updateInfo() {
     this.snackBar.open('Your user has been updated', 'OK', {
      duration: 2000,
    });
  }

   configureCards() {
    this.isMobile = window.matchMedia('(max-width: 900px)').matches;
  }
  
  onScroll(){
    this.authService.getUser(this.userId, new HttpParams().set('skip', this.skip.toString()).set('limit', '10')).subscribe((response) => {
        this.skip = this.skip + 10;
        const newPosts = this.reformatPosts(response.data.posts, true);
    });
  }
  
  public reformatPosts(array: any[], push: Boolean = false){
    const newPosts = array.map((value) => {
      let newValue = value;
      newValue.user = this.user;
      return newValue;
    });
    if (push){
      this.user.posts = [...this.user.posts, ...newPosts];
    } else {
      this.user.posts = [...newPosts];
    }
  }
  
  public updateLoadBar() {
    this.sendRequest = !this.sendRequest;
  }

}
