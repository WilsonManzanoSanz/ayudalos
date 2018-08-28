import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import {AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';
import { AngularFireStorage,  AngularFireUploadTask , AngularFireStorageReference} from 'angularfire2/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  // Firestore
  public filePath: string;
  public fileRef: AngularFireStorageReference;

  constructor(private firebaseAuth: AngularFireAuth, private fireReference: AngularFirestore,
  private fireStore: AngularFirestore, private fireStorage: AngularFireStorage, private http: HttpClient) {
    console.log('Auth service init...');
      this.firebaseAuth.user.subscribe((user) => {
        if (user) {
          if (localStorage.getItem(`user_${user.uid}`)) {
            this.user = JSON.parse(localStorage.getItem(`user_${user.uid}`));
          } else {
            this.getUser(user).subscribe(response => {
                this.user = response.data;
                localStorage.setItem(`user_${user.uid}`, JSON.stringify(response.data));
            }, error => console.log(error));
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
       result.user['typeUserId'] = 3;
        this.registerUser(result.user).subscribe(
           data => this.getUser(result.user).subscribe((response) => {
              this.user = response.data;
           }),
           err => console.log(err)
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
        result.user['typeUserId'] = 2;
        this.registerUser(result.user).subscribe(
           data => this.getUser(result.user).subscribe((response) => {
             this.user = response.data;
           }),
           err => console.log(err)
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

  public oAuthLogin(provider: any) {
    return this.firebaseAuth.auth
      .signInWithPopup(provider)
      .then(credential => {
        console.log('listener', credential);
        return this.getToken();
      })
      .catch(error => this.handleError(error));
  }

  // Auth with email//password
  public emailLogin(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.firebaseAuth.auth.signInWithEmailAndPassword(email, password).then((response) => {
        response.user['typeUserId'] = 1;
        this.registerUser(response.user).subscribe(
           data => this.getUser(response.user).subscribe((responseUser) => {
              console.log(responseUser);
              this.user = responseUser.data;
           }),
           err => this.getUser(response.user).subscribe((errorUser) => {
              this.user = errorUser.data;
           }, (error) => console.error(error))
        );
        resolve(response);
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

  public getPetitionsByUser(user) {
  }

  public getDonationsByUser(user) {
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

  public getUser(user: any) {
    console.log('se invoco... get User');
    return this.http.get<any>(`${this.URL}/${user.uid}`);
  }

  public getCurrentlyUser() {
    return this.user;
  }

  public hardLoadUser() {
      return this.firebaseAuth.user;
  }

  public getFirebaseUser() {
    return this.firebaseAuth.auth.currentUser;
  }

  public setUser(user) {
    this.user = user;
    // console.log(this.user);
  }

  public handleError(error) {
    console.error(error);
  }


}
