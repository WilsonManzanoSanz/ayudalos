import { NgModule } from '@angular/core';
// Route
import {PostsRoutingModule} from './route/posts-route.module';
// UI
import { MaterialModule } from '../ui/material.module';
// Firebase
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage';
// Component
import { PetitionsComponent } from './petitions/petitions.component';
import { PostsCardComponent } from './posts-card/posts-card.component';
import { DonationsComponent } from './donations/donations.component';
import { PostComponent } from './post/post.component';
// Service
import { PostsService } from './shared/posts.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SearchComponent } from './search/search.component';
import { DonationsHomeComponent } from './donations-home/donations-home.component';
import { PetitionsHomeComponent } from './petitions-home/petitions-home.component';

@NgModule({
  imports: [
    MaterialModule,
    PostsRoutingModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    InfiniteScrollModule,
  ],
  declarations: [
    DonationsComponent,
    PostComponent,
    PetitionsComponent,
    PostsCardComponent,
    SearchComponent,
    DonationsHomeComponent,
    PetitionsHomeComponent,
  ],
  providers: [PostsService],
  exports: [PostsCardComponent]
})
export class PostsModule { }
