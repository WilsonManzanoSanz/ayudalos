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

  public user: any = null;
  private providerGoogle = new firebase.auth.GoogleAuthProvider();
  private providerFb = new firebase.auth.FacebookAuthProvider();
  private token = '';
  private URL = environment.urlbase;
  // Firestore
  public filePath: string;
  public fileRef: AngularFireStorageReference;
  private postsCollection: AngularFirestoreCollection<any>;

  constructor(public firebaseAuth: AngularFireAuth, private fireReference: AngularFirestore,
  private fireStore: AngularFirestore, private fireStorage: AngularFireStorage, private http: HttpClient) {
    console.log('Auth service init...');
    this.postsCollection = this.fireReference.collection<any>('posts');
    this.onAuthStateChanged().then((user) => {
      if(user){
         this.getUser(user).subscribe(data=>{
           this.user = data['response'];
         }, error=> console.log(error));
      }     
    }).catch((error) => {
      console.error(error);
    });

  }

  public googleLogin() {
    return new Promise((resolve, reject) => {
      this.firebaseAuth.auth.signInWithPopup(this.providerGoogle).then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // this.token = result.credential.providerId;
        // The signed-in user info.
        this.registerUser(result.user).subscribe(
           data => this.getUser(result.user).subscribe((data)=>{
              console.log(data);
           //this.user = data.response;
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
        this.registerUser(result.user).subscribe(
           data => this.getUser(result.user).subscribe((data)=>{
             this.user = data['response'];
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

  private oAuthLogin(provider: any) {
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
        this.registerUser(response.user).subscribe(
           data => this.getUser(response.user).subscribe((data)=>{
              this.user = data['response'];
              console.log(this.user);
           }),
           err => this.getUser(response.user).subscribe((response)=>{
              this.user = response['response'];
           },(error)=>console.error(error))
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
      this.user = null;
      this.token = '';
    });
  }

  public getToken() {
    this.refreshUser();
    if(this.token){
      return this.token;
    }
    if(this.user){
      this.firebaseAuth.auth.currentUser.getIdToken(/* forceRefresh */ true).then((idToken)=>{
          this.token = idToken;
          return idToken;
      });
    }
    return this.token;
  }
  
  public refreshUser(){
    this.user = this.firebaseAuth.auth.currentUser;
  }
  
  public registerUser(user:any){
    return this.http.post(this.URL, user);
  }
  
  public updateUser(user:any){
    return this.http.put(this.URL, user);
  }
  
  public getUser(user:any){
    return this.http.get(`${this.URL}/${user.uid}`);
  }
  
  public getCurrentlyUser() {
    return this.user;
  }
  
  public setUser(user) {
    this.user = user;
  }

  public uploadPhofilePhoto(file) {
    this.filePath =  this.user.uid + '/photo';
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
        //thiss.updateUserData(Object.assign({}, thiss.user, editedUser));
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
      this.postsCollection = this.fireReference.collection<any>('posts',
          ref => ref.where('type', '==', 2).where('uid', '==', user.uid).limit(20));
      return  this.postsCollection.snapshotChanges().pipe(map(actions => actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
      })));
  }

  public getDonationsByUser(user) {
      this.postsCollection = this.fireReference.collection<any>('posts',
          ref => ref.where('type', '==', 1).where('uid', '==', user.uid).limit(20));
      return this.postsCollection.snapshotChanges().pipe(map(actions => actions.map(a => {
          const data = a.payload.doc.data() as any;
          const id = a.payload.doc.id;
          return { id, ...data };
      })));
  }

  private handleError(error) {
    console.log(error);
  }


}