import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DonationsComponent } from '../donations/donations.component';
import { DonationComponent } from '../donation/donation.component';
import { PetitionsComponent } from '../petitions/petitions.component';
import { DonationsHomeComponent } from '../donations-home/donations-home.component';
import { PetitionsHomeComponent } from '../petitions-home/petitions-home.component';
import {AuthGuard} from '../../core/auth.guard';

const ROUTES: Routes = [
  { path: 'donations/home', component: DonationsHomeComponent },
  { path: 'petitions/home', component: PetitionsHomeComponent },
  { path: 'donations', component: DonationsComponent, canActivate: [AuthGuard] },
  { path: 'donations', component: DonationsComponent, canActivate: [AuthGuard] },
  { path: 'donation/:id', component: DonationComponent},
  { path: 'petitions', component: PetitionsComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class PostsRoutingModule { }
