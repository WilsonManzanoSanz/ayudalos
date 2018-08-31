import { NgModule } from '@angular/core';
// Material
import { MaterialModule } from '../ui/material.module';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
// Routes
import { AuthRoutingModule } from './route/auth-route.module';
// Components
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RegisterComponent } from './register/register.component';
import { MyprofileComponent } from './myprofile/myprofile.component';
import { ProfileComponent } from './profile/profile.component';
// Shared module
 import { PostsModule } from '../posts/posts.module';
// Scroll
import { InfiniteScrollModule } from 'ngx-infinite-scroll';


@NgModule({
  imports: [
    MaterialModule,
    AuthRoutingModule,
    InfiniteScrollModule,
    PostsModule,
    HttpClientModule,
  ],
  exports: [],
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    RegisterComponent,
    MyprofileComponent,
    ProfileComponent,
  ],
  providers: []
})
export class AuthModule { }
