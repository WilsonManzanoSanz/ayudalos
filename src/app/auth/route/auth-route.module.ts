import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import {ForgotPasswordComponent} from '../forgot-password/forgot-password.component';
import {RegisterComponent} from '../register/register.component';
import {MyprofileComponent} from '../myprofile/myprofile.component';
import { ProfileComponent } from '../profile/profile.component';


const ROUTES: Routes = [
  { path: '', component: LoginComponent},
  { path: 'forgotpassword', component: ForgotPasswordComponent},
  { path: 'register', component: RegisterComponent },
  { path: 'myprofile', component: MyprofileComponent },
  { path: 'profile/:id', component: ProfileComponent }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
