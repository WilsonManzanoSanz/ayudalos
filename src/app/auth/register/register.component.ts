import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../core/auth.service';
import {Router} from '@angular/router';
import {PasswordValidator} from '../class/PasswordValidation';
import { AngularFireStorage } from 'angularfire2/storage';
import { finalize } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';



@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  public registerFormGroup: FormGroup;
  public registerObject: any = {email: '', password: '', password2: '', displayName: ''};
  public sendRequest: Boolean = false;
  public wrongCredentials: Boolean = false;
  public passwordValidator = new PasswordValidator();
  public photo: any = null;

  constructor(private authService: AuthService, private router: Router, private storage: AngularFireStorage, private http: HttpClient) {
  }

  ngOnInit() {
    this.registerFormGroup = new FormGroup({
      displayName: new FormControl(this.registerObject.displayName, [
        Validators.required,
        Validators.minLength(8)
      ]),
      email: new FormControl(this.registerObject.email, [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl(this.registerObject.password, [
        Validators.required,
        Validators.minLength(6)
      ]),
      password2: new FormControl(this.registerObject.password2 , [
        Validators.required,
        this.passwordValidator.validate
      ])
    });
  }

  attemptToRegister(form: FormGroup) {
    if (form.valid) {
      this.updateLoadBar();
      this.wrongCredentials = false;
      this.authService.emailSignUp(this.registerFormGroup.value.email, this.registerFormGroup.value.password).then((response) => {
         this.updateProfile(response, form.value.displayName);
       }).catch((error) => {
          console.error(error);
          this.updateLoadBar();
          this.wrongCredentials = true;
      });

    }
  }

   updateProfile(user, displayName) {
    if (Boolean(this.photo)) {
       // If can get the percent in the subscribe funciton
       this.authService.uploadPhofilePhoto(user.uid, this.photo).snapshotChanges().pipe(
          finalize(() => {
            this.authService.fileRef.getDownloadURL().subscribe((response) => {
                 const newUser = {
                  displayName: displayName,
                  photoURL: response,
                  uid: user.uid,
                  email: user.email,
                  typeUserId:4,
                };
                this.registerUser(newUser);
            });
          })
       ).subscribe();
    } else {
      const newUser = {
        displayName: displayName,
        photoURL: user.photoURL,
        uid: user.uid,
        email: user.email,
        typeUserId:4,
      };
      this.registerUser(newUser);
    }
  }

  registerUser(user:any) {
    this.authService.registerUser(user).subscribe((data) => {
      this.updateLoadBar();
      this.router.navigateByUrl('/');
      this.authService.getToken();
      /*
      this.authService.getUser(user).subscribe( response => {
         this.authService.setUser(response.data);
      }, error=> console.log(error));
      */
    },(error)=>{
    console.error(error);
      this.updateLoadBar();
    });
  }

  updateLoadBar() {
    this.sendRequest = !this.sendRequest;
  }

  inputPhoto() {
    document.getElementById('fileToUpload').click();
    const fileInput = document.getElementById('fileToUpload');
    fileInput.addEventListener('change', (e: any) => this.savePhotoInCache(e.target.files[0]));
  }

  savePhotoInCache(file) {
     this.photo = file;
  }



}
