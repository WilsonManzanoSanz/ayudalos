import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import {
   debounceTime, distinctUntilChanged, switchMap
 } from 'rxjs/operators';
import {PostsService, Post} from '../shared/posts.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

 @Input() stateSearchBar: string;
  public searchQuery = '';
  public searchTerms = new Subject<string>();
  posts$: Observable<Post[]>;
   @Output() closeElement = new EventEmitter<boolean>();

  constructor(public postService: PostsService) { }

  ngOnInit(): void {
    this.posts$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.postService.searchPosts(term)),
    );
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  hideElement() {
    this.searchQuery = '';
    this.closeElement.emit();
  }

}
