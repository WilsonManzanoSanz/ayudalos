import {User} from '../../core/auth.service';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection
} from 'angularfire2/firestore';
import {SidenavService} from '../../ui/shared/sidenav.service';
import { AngularFireStorage,  AngularFireUploadTask } from 'angularfire2/storage';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of  } from 'rxjs';
import { map } from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';


export interface Comment extends User {
  description: string;
}

export interface Post extends User {
  tittle: string;
  description: string;
  tags?: string[];
  photos?: string;
  comments?: Comment[];
  inputComment?: string;
  id?: string;
}

@Injectable()
export class PostsService {

  private postsCollection: AngularFirestoreCollection<any>;
  private postDoc: AngularFirestoreDocument<any>;
  private filePath;
  public fileRef = null;
  private posts: Observable<any[]>;
  private lastEntry;
  private URL = environment.urlbase + '/posts/' ;

  constructor(
    public fireReference: AngularFirestore,
    public sidenavService: SidenavService,
    public fireStorage: AngularFireStorage,
    public http: HttpClient,
    ) {
    this.postsCollection = this.fireReference.collection<any>('posts');
  }

  public getLastEntry() {
    return this.lastEntry;
  }

  public getTypes() {
     const types = this.fireReference.collection<any>('post-types');
     return types.valueChanges();
  }

  public getDonations(params =  new HttpParams().set('skip', '0').set('limit', '10')) {
    return this.http.get<any>(this.URL, {params: params});
  }

  public getDonation(id, params) {
    return this.http.get<any>(`${this.URL}/${id}`, params);
  }


  public getPetitions(startAfter = '', limit = 14) {
    this.postsCollection = this.fireReference.collection<any>('posts',
    ref => ref.where('type', '==', 2).orderBy('email', 'asc').limit(limit).startAfter(startAfter));
    this.posts = this.postsCollection.snapshotChanges().pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data() as any;
        const id = a.payload.doc.id;
        if (a.payload.newIndex === actions.length - 1) {
          this.lastEntry = a.payload.doc;
        }
        return { id, ...data };
     })));
    return this.posts;
  }

  public searchPosts (term: string, type: number = 1): Observable<any[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      return of([]);
    }
    this.postsCollection = this.fireReference.collection<Post>('posts',
    ref => ref.where('type', '==', 1).where('tittle', '==', 'term'));
    return this.postsCollection.valueChanges();
  }

  public newPost(body: any) {
     return this.http.post<any>(this.URL, body);
  }

  public updatePost(body: any) {
    return this.http.put<any>(this.URL, body);
  }

  public uploadPostPhoto(file, userId) {
    this.filePath =  `${userId}/posts/${file.name}${file.lastModified}`;
    this.fileRef = this.fireStorage.ref(this.filePath);
    return this.fireStorage.upload(this.filePath, file);
  }

  public showNav() {
    document.getElementById('fullscreen-post-container').style.height = '100%';
    this.sidenavService.hideNav();
  }

  public closeNav() {
    document.getElementById('fullscreen-post-container').style.height = '0%';
    this.sidenavService.showNav();
  }

  // TODO SEPARETE MODEL AND SERVICE
  public separateIntoTwoArrays(array: any[] = [], newArray: any[] = [], odds: any[] = [], evens: any[]= []) {
    let isOdd: Boolean = false;
    if (array.length === 0 || array.length % 2 === 0 ) {
      isOdd = true;
    }
    newArray.forEach(value => {
      if (isOdd) {
        odds.push(value);
      } else {
        evens.push(value);
      }
      isOdd = !isOdd;
    });
    return [...array, ...newArray];
  }

}
