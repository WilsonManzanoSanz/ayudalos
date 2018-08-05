import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

export interface Collaborator {
  displayName: string;
  email: string;
  photoURL: string;
  degree: string;
  description: string;
  resume?: string;
  github?: string;
}

@Injectable()
export class AboutService {

  public collaborators: Observable<Collaborator[]>;
  private collaboratorsCollection: AngularFirestoreCollection<Collaborator>;

  constructor(private readonly fireReference: AngularFirestore) {
    this.collaboratorsCollection = fireReference.collection<Collaborator>('collaborators');
  }

  public getCollaborators() {
    return this.collaboratorsCollection.valueChanges();
  }


}
