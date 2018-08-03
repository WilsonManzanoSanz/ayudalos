import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { firebase } from '@firebase/app';
import { AngularFireStorage,  AngularFireUploadTask , AngularFireStorageReference} from 'angularfire2/storage';

export interface User {
  uid: string;
  email?: string | null;
  photoURL?: string;
  displayName?: string;
}


@Injectable()
export class AuthService {

  private user: any;
  private providerGoogle = new firebase.auth.GoogleAuthProvider();
  private providerFb = new firebase.auth.FacebookAuthProvider();
  private token:string = '';
  //Firestore
  public filePath:string; 
  public fileRef:AngularFireStorageReference;
  
  constructor(public firebaseAuth: AngularFireAuth, 
  private fireStore: AngularFirestore,private fireStorage: AngularFireStorage) {
    
    this.onAuthStateChanged().then((user)=> {
       this.updateUserData(user);
    }).catch((error) => {
      this.user = null;
    });
   
  }
  
  public googleLogin() {
    return new Promise((resolve, reject) => {
      this.firebaseAuth.auth.signInWithPopup(this.providerGoogle).then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        this.token = result.credential.accessToken;
        // The signed-in user info.
        this.updateUserData(result.user);
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
        this.token = result.credential.accessToken;
        // The signed-in user info.
        this.updateUserData(result.user);
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
        return this.updateUserData(credential.user);
      })
      .catch(error => this.handleError(error));
  }
  
  //Auth with email//password

  public emailLogin(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.firebaseAuth.auth.signInWithEmailAndPassword(email, password).then((response) => {
        this.updateUserData(response.user);
        resolve(response);
      }).catch((error) => {
        this.handleError(error);
        reject(error);
      });
    });    
  }
  
  public emailSignUp(email: string, password: string){
    return new Promise((resolve, reject) => {
      this.firebaseAuth.auth.createUserWithEmailAndPassword(email, password).then((response) => {
        this.updateUserData(response.user);
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
        resolve(message);
      }).catch((error) => {
        this.handleError(error);
        reject(error);
      });
    });
  }
  
  public onAuthStateChanged(){
    return new Promise((resolve, reject) => {
      this.firebaseAuth.auth.onAuthStateChanged(function(user){
        resolve(user);
        })
      });
   }
  
   public signOut() {
    this.firebaseAuth.auth.signOut().then(() => {
      this.user = null;
    });
  }
 

  public updateUserData(user: any) {
    const userRef: AngularFirestoreDocument<any> = this.fireStore.doc(`users/${user.uid}`);

    this.user = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };

    return userRef.set(this.user, { merge: true });

    
  }

  public uploadPhofilePhoto(file){
    this.filePath =  this.user.uid + '/photo';
    this.fileRef = this.fireStorage.ref(this.filePath);
    const task:AngularFireUploadTask = this.fireStorage.upload(this.filePath, file);
    return task;
  }
  
  public updateProfile(user:any){
    let editedUser:any = {};
    if(user.photoURL){
      editedUser = { displayName: user.displayName, photoURL: user.photoURL};
    }else{ editedUser = { displayName: user.displayName}; }
    const thiss = this;
    return new Promise(( resolve, reject) => {
      this.firebaseAuth.auth.currentUser.updateProfile(editedUser).then(function(user) {
           thiss.updateUserData(Object.assign({}, thiss.user, editedUser));
           resolve(user);
        }).catch(function(error) {
           reject(error);
        });
      });      
  }
  
  public updatePassword(newPassword:string){
    return new Promise((resolve, reject) => {
       this.firebaseAuth.auth.currentUser.updatePassword(newPassword).then(function() {
        resolve('success');
      }).catch(function(error) {
        reject(error);
      });
    });
  }

  public getCurrentlyUser() {
    return this.user;
  }

  public getCurrentlyUserFromTheServer(){

  }

  private handleError(error) {
    console.log(error);
  }
  

}
