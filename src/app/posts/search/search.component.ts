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
  @Output() closeElement = new EventEmitter<any>();
  @Output() updatePosts = new EventEmitter<any>();

  constructor(public postService: PostsService) { }

  ngOnInit(): void {
    this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap(
        (term: string) => {
          console.log(term);
          return this.postService.searchPosts(term);
        })
    ).subscribe(data => { 
      if(data['data'].items){
        this.updatePosts.emit(data['data'].items);
      }else{
        this.updatePosts.emit(data['data']);
      }
    }, 
                error => console.error(error));
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  hideElement() {
    this.searchQuery = '';
    this.closeElement.emit();
  }

}
