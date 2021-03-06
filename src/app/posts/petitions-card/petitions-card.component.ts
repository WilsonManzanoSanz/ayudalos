import { Component, OnInit, Input  } from '@angular/core';
import {AuthService, User} from '../../core/auth.service';
import {PetitionsService, Petition} from '../shared/petitions.service';
import {ConfirmDeleteDialogComponent} from '../confirm-delete-dialog/confirm-delete-dialog.component';
import {ShareDialogComponent} from '../share-dialog/share-dialog.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {environment} from './../../../environments/environment';

@Component({
  selector: 'app-petitions-card',
  templateUrl: './petitions-card.component.html',
  styleUrls: ['./petitions-card.component.css']
})
export class PetitionsCardComponent implements OnInit {

  @Input() petitions: Petition[];
  @Input() user: any;
  @Input() allowedDelete: Boolean;
  date_view: Boolean = false;

  constructor(public petitionService: PetitionsService, private authService: AuthService, public dialog: MatDialog) {
  }

  ngOnInit() {
  }

  postComment(value: string, idx: number, petitionId) {
    if (Boolean(value)) {
      const newComment = {
        description: value,
        petitionId : petitionId,
        userUid : this.user.uid
      };
      this.petitionService.postComment(newComment).subscribe(response => {
        const newComment = {...response.data, uid: this.user.uid, user: this.user};
        this.petitions[idx].commentPetitions.push(newComment);
        this.petitions[idx].inputComment = ''
      }, error => console.error(error));
    }
  }
  
  openDialog(idx: number): void {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '250px',
      data: {name: this.user.displayName}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.deletePetition(idx);
      }
    });
  }
  
  openShareProcess(idx){
    const url = `${environment.urlpage}/posts/petition/${this.petitions[idx].id}`;
    if (navigator['share']) {
      navigator['share']({
          title: `${this.petitions[idx].tittle} en Ayudalos`,
          text: this.petitions[idx].tittle,
          url: url,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    }else{
      const dialogRef = this.dialog.open(ShareDialogComponent, {
        width: '60%',
        data: url
      });

      dialogRef.afterClosed().subscribe(result => {
      });
    }
  }
  
  mouseEnter(idx: number){
    this.petitions[idx].date_view = !this.petitions[idx].date_view;
  }
  
  mouseLeave(idx: number){
    this.petitions[idx].date_view = !this.petitions[idx].date_view;
  }
  
  deletePetition(idx: number){
     this.petitionService.deletePetition(this.petitions[idx].id, this.petitions[idx].user).subscribe(response => {
       console.log(response);
      if(response.success){
          if(this.petitions[idx].photoURL){
            this.petitionService.deletePhoto(this.petitions[idx].photoURL);
          }
          this.petitions.splice(idx, 1);
      }
    }, error => console.error(error));     
  }

}
