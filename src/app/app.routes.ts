import { RouterModule, Routes } from '@angular/router';

import {LoginComponent} from './auth/login/login.component';
import {HomeComponent} from './home/home.component';
import {AboutusComponent} from './aboutus/aboutus.component';

const APP_ROUTE: Routes = [
  { path: 'home', component:  HomeComponent},
  { path: 'aboutus', component: AboutusComponent},
  { path: 'auth', loadChildren: './auth/auth.module#AuthModule' },
  { path: 'posts', loadChildren: './posts/posts.module#PostsModule'},
  { path: '**', pathMatch: 'full', redirectTo: 'home' }
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTE);
