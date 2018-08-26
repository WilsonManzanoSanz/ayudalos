import { Component, OnInit, Input  } from '@angular/core';
import {AuthService, User} from '../../core/auth.service';
import {PostsService, Post} from '../shared/posts.service';

@Component({
  selector: 'app-posts-card',
  templateUrl: './posts-card.component.html',
  styleUrls: ['./posts-card.component.css']
})
export class PostsCardComponent implements OnInit {

  @Input() posts: Post[];
  user: User;

  constructor(public postService: PostsService, private authService: AuthService) {
    this.user = this.authService.getCurrentlyUser();
  }

  ngOnInit() {

  }

  postComment(value: string, idx: number) {
    if (Boolean(value)) {
      this.cleanComment(value, idx);
      this.postService.updatePost(this.posts[idx]).subscribe(response => {
        console.log('comment inserted');
      }, error => {
        console.log(error);
        this.posts[idx].comments.splice(idx, 1);
      });
    }
  }

  public cleanComment(value: string, idx: number) {
    const newComment =  {...{description: value}, ...this.user};
    if (this.posts[idx].comments === undefined) {
      this.posts[idx].comments = [newComment];
    } else {
        this.posts[idx].comments.push(newComment);
    }
    this.posts[idx].inputComment = '';
  }

}
