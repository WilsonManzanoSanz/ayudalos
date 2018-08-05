import { NgModule } from '@angular/core';
// Material
import { MaterialModule } from '../ui/material.module';
import { LoginComponent } from './login/login.component';
// Routes
import { AuthRoutingModule } from './route/auth-route.module';
// Components
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { RegisterComponent } from './register/register.component';
import { MyprofileComponent } from './myprofile/myprofile.component';
import { ProfileComponent } from './profile/profile.component';
// Shared module
 import { PostsModule } from '../posts/posts.module';


@NgModule({
  imports: [
    MaterialModule,
    AuthRoutingModule,
    PostsModule,
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
