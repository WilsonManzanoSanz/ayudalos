import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {User} from '../../core/auth.service';
import 
{ 
  AngularFirestore, 
  AngularFirestoreDocument,
  AngularFirestoreCollection
} from 'angularfire2/firestore';
import {SidenavService} from '../../ui/shared/sidenav.service';
import { AngularFireStorage,  AngularFireUploadTask , AngularFireStorageReference} from 'angularfire2/storage';
import { Observable, of  } from 'rxjs';
import { map } from 'rxjs/operators';
import {AuthModule} from '../../auth/auth.module';

export interface Comment extends User{
  description:string,
}

export interface Post extends User{
  tittle:string,
  description:string,
  tags?:string[]
  photos?:string,
  comments?:Comment[],
  inputComment?:string,
  id?:string,
}

@Injectable({
    providedIn: AuthModule,
})
export class PostsService {
  
  private postsCollection: AngularFirestoreCollection<Post>;
  private postDoc: AngularFirestoreDocument<Post>;
  private donations:Observable<Post[]>;
  private filePath;
  public fileRef = null;
  private task:AngularFireUploadTask;
  private posts:Observable<Post[]>;
  private typePost:any = {name:'Donation', type:1};
  private lastEntry;

  constructor(
    private fireReference: AngularFirestore, 
    private sidenavService:SidenavService,
    private fireStorage: AngularFireStorage, 
    private router: Router, 
    ) {
    this.postsCollection = this.fireReference.collection<Post>('posts');
  }

  public getLastEntry(){
    return this.lastEntry;
  }
  
  public getTypes(){
     const types = this.fireReference.collection<any>('post-types');
     return types.valueChanges();
  }

  public getDonations(startAfter = '', limit = 14){
    this.postsCollection = this.fireReference.collection<Post>('posts', 
    ref=>ref.where('type', '==', 1).orderBy('email', 'asc').limit(limit).startAfter(startAfter));
    this.posts = this.postsCollection.snapshotChanges().pipe(map(actions=>actions.map(a=>{
        const data = a.payload.doc.data() as Post;
        const id = a.payload.doc.id;
        if(a.payload.newIndex === actions.length-1){
          this.lastEntry = a.payload.doc;
        }
        return { id, ...data };
     })));
    return this.posts;
  }


  public getPetitions(startAfter = '', limit = 14){
    this.postsCollection = this.fireReference.collection<Post>('posts', 
    ref=>ref.where('type', '==', 2).orderBy('email', 'asc').limit(limit).startAfter(startAfter));
    this.posts = this.postsCollection.snapshotChanges().pipe(map(actions=>actions.map(a=>{
        const data = a.payload.doc.data() as Post;
        const id = a.payload.doc.id;
        if(a.payload.newIndex === actions.length-1){
          this.lastEntry = a.payload.doc;
        }
        return { id, ...data };
     })));
    return this.posts;
  }

  public searchPosts (term:string,type:number = 1): Observable<Post[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    this.postsCollection = this.fireReference.collection<Post>('posts', 
    ref=>ref.where('type', '==', 1).where('tittle', '==', 'term'));
    return this.postsCollection.valueChanges();
    
  }

  public newPost(post:any){
    return this.postsCollection.add(post);
  }

  public updatePost(post:Post){
     this.postDoc = this.fireReference.doc<Post>('posts/' + post.id);
     return this.postDoc.update(post);
  }

  public uploadPostPhoto(file, userId){
    this.filePath =  `${userId}/posts/${file.name}${file.lastModified}`;
    this.fileRef = this.fireStorage.ref(this.filePath);
    const task:AngularFireUploadTask = this.fireStorage.upload(this.filePath, file);
    return task;
  }

  public getPetitionsByUser(user){
    this.postsCollection = this.fireReference.collection<Post>('posts', 
    ref=>ref.where('type', '==', 2).where('uid', '==', user.uid).limit(20));
    this.posts = this.postsCollection.snapshotChanges().pipe(map(actions=>actions.map(a=>{
        const data = a.payload.doc.data() as Post;
        const id = a.payload.doc.id;
        return { id, ...data };
     })));
    return this.posts;
  }
  
  public getDonationsByUser(user){
    this.postsCollection = this.fireReference.collection<Post>('posts', 
    ref=>ref.where('type', '==', 1).where('uid', '==', user.uid).limit(20));
    this.posts = this.postsCollection.snapshotChanges().pipe(map(actions=>actions.map(a=>{
        const data = a.payload.doc.data() as Post;
        const id = a.payload.doc.id;
        return { id, ...data };
     })));
    return this.posts;
  }

  public showNav(){
    document.getElementById("fullscreen-post-container").style.height = "100%";
    this.sidenavService.hideNav();
  }

  public closeNav(){
    document.getElementById("fullscreen-post-container").style.height = "0%";
    this.sidenavService.showNav();
  }

  //TODO SEPARETE MODEL AND SERVICE
  public separateIntoTwoArrays(array:any[] = [], odds:any[] = [], evens:any[]= []){
    let checker:Boolean = true;
    array.forEach(value=>{
      checker = !checker;
      if(checker){
        odds.push(value);
      }else{
        evens.push(value);
      }
    });
  }
 
}