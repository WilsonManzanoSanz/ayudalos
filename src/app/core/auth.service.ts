import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import { AngularFireStorage,  AngularFireUploadTask , AngularFireStorageReference} from 'angularfire2/storage';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {MatSnackBar} from '@angular/material';
import * as firebase from 'firebase/app';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';

export interface User {
  uid: string;
  email?: string | null;
  photoURL?: string;
  displayName?: string;
}

@Injectable()
export class AuthService {

  private user: any = null;
  private providerGoogle = new firebase.auth.GoogleAuthProvider();
  private providerFb = new firebase.auth.FacebookAuthProvider();
  private token = '';
  private URL = environment.urlbase + '/users';
  private previousUrl = null;
  private loadingUser = null;
  // Firestore
  public filePath: string;
  public fileRef: AngularFireStorageReference;

  constructor(private firebaseAuth: AngularFireAuth, private fireReference: AngularFirestore, public snackBar: MatSnackBar,
  private fireStore: AngularFirestore, private fireStorage: AngularFireStorage, private http: HttpClient) {
    console.log('Auth service init...');
    this.initializeUser();
  }
  
  public initializeUser(){
    this.firebaseAuth.user.subscribe((user) => {
        if (user) {
          if (localStorage.getItem(`user_${user.uid}`)) {
            this.user = JSON.parse(localStorage.getItem(`user_${user.uid}`));
          } else {
            this.loadingUser = new Promise((resolve, reject) => {
              this.getUser(user).subscribe(response => {
              if(response.data){
                  this.user = response.data;
                  localStorage.setItem(`user_${user.uid}`, JSON.stringify(response.data));
                  resolve(this.user);
                } 
              }, error => {
                reject(error);
                console.error(error);
              });
            });
          }
        }
      }, (error) => console.error(error));
  }

  public googleLogin() {
    return new Promise((resolve, reject) => {
      this.firebaseAuth.auth.signInWithPopup(this.providerGoogle).then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // this.token = result.credential.providerId;
        // The signed-in user info.
        const newUser  = { uid: result.user.uid, typeUserId:1, 
                               email: result.user.email, displayName: result.user.displayName, photoURL: result.user.photoURL};
        this.registerUser(newUser).subscribe(
           data => console.log('registered', data),
           err => console.error(err)
        );
        resolve(result.user);
        // ...
      }).catch(function(error) {
        // Handle Errors here.
        reject(error);
        // ...
      });
    });
  }

  public facebookLogin() {
    return new Promise((resolve, reject) => {
      this.firebaseAuth.auth.signInWithPopup(this.providerFb).then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // this.token = result.credential.providerId;
        // The signed-in user info.
        const newUser  = { uid: result.user.uid, typeUserId:2, 
                               email: result.user.email, displayName: result.user.displayName, photoURL: result.user.photoURL};
        this.registerUser(newUser).subscribe(
          data => console.log(data),
           err => console.error(err)
        );
        resolve(result.user);
        // ...
      }).catch(function(error) {
        // Handle Errors here.
        reject(error);
        // ...
      });
    });
  }

  // Auth with email//password
  public emailLogin(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.firebaseAuth.auth.signInWithEmailAndPassword(email, password).then((result) => {
        /*
        const newUser  = { uid: result.user.uid, typeUserId:4,};
        this.registerUser(newUser).subscribe(
           data => this.user = data.response,
           err => console.error(err)
        );*/
        // this.initializeUser();
        resolve(result);
      }).catch((error) => {
        this.handleError(error);
        reject(error);
      });
    });
  }

  public emailSignUp(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password).then((response) => {
        resolve(response.user);
        this.initializeUser();
      }).catch((error) => {
        this.handleError(error);
        reject(error);
      });
    });
  }

  public resetPassword(email: string) {
    return new Promise((resolve, reject) => {
      this.firebaseAuth.auth.sendPasswordResetEmail(email).then((message) => {
        resolve('OK');
      }).catch((error) => {
        this.handleError(error);
        reject(error);
      });
    });
  }

  public onAuthStateChanged() {
    return new Promise((resolve, reject) => {
      this.firebaseAuth.auth.onAuthStateChanged(function(user) {
        resolve(user);
        });
      });
   }

   public signOut() {
    this.firebaseAuth.auth.signOut().then(() => {
      localStorage.removeItem(`user_${this.user.uid}`);
      this.user = null;
      this.token = '';
    });
  }

  public getToken() {
    if (this.token) {
      return this.token;
    }
    if (this.user) {
      this.firebaseAuth.auth.currentUser.getIdToken(/* forceRefresh */ ).then((idToken) => {
          this.token = idToken;
          return idToken;
      });
    }
    return this.token;
  }

  public uploadPhofilePhoto(uid, file) {
    this.filePath =  uid + '/photo';
    this.fileRef = this.fireStorage.ref(this.filePath);
    const task: AngularFireUploadTask = this.fireStorage.upload(this.filePath, file);
    return task;
  }

  public updateProfile(user: any) {
    let editedUser: any = {};
    if (user.photoURL) {
      editedUser = { displayName: user.displayName, photoURL: user.photoURL};
    } else { editedUser = { displayName: user.displayName}; }
    const thiss = this;
    return new Promise(( resolve, reject) => {
      this.firebaseAuth.auth.currentUser.updateProfile(editedUser).then(response => {
        // thiss.updateUserData(Object.assign({}, thiss.user, editedUser));
        resolve(user);
      }).catch(function(error) {
        reject(error);
      });
    });
  }

  public updatePassword(newPassword: string) {
    return new Promise((resolve, reject) => {
       this.firebaseAuth.auth.currentUser.updatePassword(newPassword).then(function() {
        resolve('success');
      }).catch(function(error) {
        reject(error);
      });
    });
  }

  public refreshUser() {
    this.user = this.firebaseAuth.auth.currentUser;
  }

  public registerUser(user: any) {
    return this.http.post<any>(this.URL, user);
  }

  public updateUser(user: any) {
    return this.http.put<any>(`${this.URL}/${user.uid}`, user);
  }

  public getUser(user: any, params = new HttpParams().set('skip', '0').set('limit', '10')) {
    console.log('getUser');
    return this.http.get<any>(`${this.URL}/${user.uid}`, {params:params});
  }

  public getUserValue() {
    return this.user;
  }
  
  public getCurrentUser(){
    return new Promise((resolve, reject) => {
      if (this.getUserValue()) {
        resolve(this.user);
      } this.hardLoadUser().subscribe(user => {
          /*if (user) {
            this.getUser(user).subscribe((responseUser) => {
                resolve(responseUser.data);
            }, error => console.error(error));
          }*/
          if(this.loadingUser){
            this.loadingUser.then(user => resolve(user)).catch(error => reject(error));
          }
        }, (error => {
            console.error(error);
            reject(error);
            })
        ); 
        
    });
  }

  public hardLoadUser() {
      return this.firebaseAuth.user;
  }

  public setUser(user) {
    this.user = user;
  }

  public handleError(error) {
    console.error(error);
  }
  
  public notifyUserRequirement(url){
    this.previousUrl = url;
    this.snackBar.open('Primero te tienes que ingresar en tu cuenta o registrarse', 'OK', {
      duration: 2000,
    });
  }
  
  public getPreviousState(){
    return this.previousUrl;
  }


}
