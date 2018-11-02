import { Component, OnInit, Input  } from '@angular/core';
import {AuthService, User} from '../../core/auth.service';
import {PostsService, Post} from '../shared/posts.service';
import {ConfirmDeleteDialogComponent} from '../confirm-delete-dialog/confirm-delete-dialog.component';
import {ShareDialogComponent} from '../share-dialog/share-dialog.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import {environment} from './../../../environments/environment';

@Component({
  selector: 'app-posts-card',
  templateUrl: './posts-card.component.html',
  styleUrls: ['./posts-card.component.css']
})
export class PostsCardComponent implements OnInit {

  @Input() posts: Post[];
  @Input() user: any;
  @Input() allowedDelete: any;
  date_view: Boolean = false;
  link: string = '';

  constructor(public postService: PostsService, private authService: AuthService, public dialog: MatDialog) {
  }

  ngOnInit() {
  }

  postComment(value: string, idx: number, postId) {
    if (Boolean(value)) {
      const newComment = {
        description: value,
        postId : postId,
        userUid : this.user.uid
      };
      this.postService.postComment(newComment).subscribe(response => {
        const newComment = {...response.data, uid: this.user.uid, user: this.user};
        this.posts[idx].commentPosts.push(newComment);
        this.posts[idx].inputComment = ''
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
        this.deletePost(idx);
      }
    });
  }
  
  openShareProcess(idx){
    const url = `${environment.urlpage}/posts/donation/${this.posts[idx].id}`;
    if (navigator['share']) {
      navigator['share']({
          title: `${this.posts[idx].tittle} en Ayudalos`,
          text: this.posts[idx].tittle,
          url: url,
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    }else{
      const dialogRef = this.dialog.open(ShareDialogComponent, {
        width: '60%',
        data: url,
      });

      dialogRef.afterClosed().subscribe(result => {
      });
    }
  }
  
  mouseEnter(idx: number){
    this.posts[idx].date_view = !this.posts[idx].date_view;
  }
  
  mouseLeave(idx: number){
    this.posts[idx].date_view = !this.posts[idx].date_view;
  }
  
  deletePost(idx: number){
     this.postService.deletePost(this.posts[idx].id, this.posts[idx].user).subscribe(response => {
       console.log(response);
      if(response.success){
          if(this.posts[idx].photoURL){
            this.postService.deletePhoto(this.posts[idx].photoURL);
          }
          this.posts.splice(idx, 1);
      }
    }, error => console.error(error));     
  }

}
