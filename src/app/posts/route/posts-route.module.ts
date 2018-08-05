import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DonationsComponent } from '../donations/donations.component';
import { PetitionsComponent } from '../petitions/petitions.component';
import {AuthGuard} from '../../core/auth.guard';

const ROUTES: Routes = [
  { path: 'donations', component: DonationsComponent, canActivate: [AuthGuard] },
  { path: 'petitions', component: PetitionsComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class PostsRoutingModule { }
