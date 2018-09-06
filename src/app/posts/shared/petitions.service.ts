import {User} from '../../core/auth.service';
import { AngularFirestore } from 'angularfire2/firestore';
import {SidenavService} from '../../ui/shared/sidenav.service';
import { AngularFireStorage,  AngularFireUploadTask } from 'angularfire2/storage';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of  } from 'rxjs';
import { map } from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';

export interface Comment {
  description: string;
  user:User;
  uid?:string;
}

export interface Petition {
  tittle: string;
  description: string;
  category: string;
  photoURL: string;
  inputComment?: string;
  id?: string;
  goal?:string;
  commentPetitions?: Comment[];
  date_view?: any;
  user?:User;
  uid?:string;
}

@Injectable()
export class PetitionsService {

  private filePath;
  public fileRef = null;
  private petitions: Observable<any[]>;
  private lastEntry;
  private URL = environment.urlbase + '/petitions/' ;
  private getParams = new HttpParams().set('skip', '0').set('limit', '10');

  constructor(
    public fireReference: AngularFirestore,
    public sidenavService: SidenavService,
    public fireStorage: AngularFireStorage,
    public http: HttpClient,
    ) {
  }

  public getPetitions() {
    return this.http.get<any>(this.URL, {params: this.getParams});
  }

  public getPetition(id, params) {
    return this.http.get<any>(`${this.URL}/${id}`, {params:params});
  }
  
  public postComment(payload){
    return this.http.post<any>(`${environment.urlbase}/petitions-comments`, payload);
  }

  public searchPosts (term: string): Observable<any[]> {
    if (!term.trim()) {
      // if not search term, return empty hero array.
      this.getParams = this.getParams.delete('key').delete('value');
    } else{
      this.getParams = this.getParams.set('key', 'tittle').set('value', term);
    }
    return this.getPetitions();
  }
  
  public addParamaters(array: any[]){
    array.forEach((element) => {
      this.getParams = this.getParams.delete(element.key);
      this.getParams = this.getParams.append(element.key, element.value);
    });
  }
  
  public deleteParamaters(array: any[]){
    array.forEach((element) => {
      this.getParams = this.getParams.delete(element.key);
    });
  }

  public newPetition(body: any) {
     return this.http.post<any>(this.URL, body);
  }

  public updatePetition(body: any) {
    return this.http.put<any>(this.URL, body);
  }
  
  public deletePetition(idx: any, data) {
    return this.http.delete<any>(`${this.URL}${idx}`, {params: data});
  }

  public uploadPetitionPhoto(file, userId) {
    this.filePath =  `${userId}/petitions/${file.name}${file.lastModified}`;
    this.fileRef = this.fireStorage.ref(this.filePath);
    return this.fireStorage.upload(this.filePath, file);
  }
  
  public deletePhoto(URL: string){
    this.fireStorage.storage.refFromURL(URL).delete().then( (response) => {
      console.log('The image has been deleted');
    }).catch( error => {
      console.error(error);
    });
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
  public separateIntoTwoArrays(array: any[] = [], newArray: any[] = [], odds: any[] = [], evens: any[]= [], uid: string, newElement: Boolean = false) {
    let isOdd: Boolean = false;
    if (array.length === 0 || array.length % 2 === 0 ) {
      isOdd = true;
    }
    newArray.forEach(value => {
      if(value.userUid === uid){
        value.allowedDelete = true;
      }
      if (isOdd) {
        if (newElement) {
          odds.unshift(value);
        } else {
          odds.push(value);
        }
      } else {
        if (newElement) {
            evens.unshift(value);
        } else {
          evens.push(value);
        }
      }
      isOdd = !isOdd;
    });
    return [...array, ...newArray];
  }

}
