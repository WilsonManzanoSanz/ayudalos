import { Component, OnInit, Input  } from '@angular/core';
import {AuthService, User} from '../../core/auth.service';
import {PostsService, Post} from '../shared/posts.service';
import {ConfirmDeleteDialogComponent} from '../confirm-delete-dialog/confirm-delete-dialog.component';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

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
      console.log('The dialog was closed');
      if(result){
        this.deletePost(idx);
      }
    });
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
          this.posts.splice(idx, 1);
      }
    }, error => console.error(error));     
  }

}
