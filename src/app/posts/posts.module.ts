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
import { PetitionsService } from './shared/petitions.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { SearchComponent } from './search/search.component';
import { DonationsHomeComponent } from './donations-home/donations-home.component';
import { PetitionsHomeComponent } from './petitions-home/petitions-home.component';
// HTTP
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './../core/token.interceptor';
import { ConfirmDeleteDialogComponent } from './confirm-delete-dialog/confirm-delete-dialog.component';
import { PetitionsCardComponent } from './petitions-card/petitions-card.component';
import { PetitionsPostComponent } from './petitions-post/petitions-post.component';
import { DonationComponent } from './donation/donation.component';
import { PetitionComponent } from './petition/petition.component';
import { ShareDialogComponent } from './share-dialog/share-dialog.component';

@NgModule({
  imports: [
    MaterialModule,
    PostsRoutingModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    InfiniteScrollModule,
    HttpClientModule
  ],
  declarations: [
   
    DonationsComponent,
    PostComponent,
    PetitionsComponent,
    PostsCardComponent,
    SearchComponent,
    DonationsHomeComponent,
    PetitionsHomeComponent,
    ConfirmDeleteDialogComponent,
    PetitionsCardComponent,
    PetitionsPostComponent,
    DonationComponent,
    PetitionComponent,
    ShareDialogComponent,
  ],
  entryComponents: [
    ConfirmDeleteDialogComponent, 
    ShareDialogComponent,
],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    PostsService,
    PetitionsService
  ],
  exports: [PostsCardComponent, PetitionsCardComponent]
})
export class PostsModule { }
