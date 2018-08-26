import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {AuthService} from './auth.service';
import {from} from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {

  }
   canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
       return new Promise<boolean>((resolve, reject) => {
           this.authService.onAuthStateChanged().then(user => {
               if (!user) {
                   this.router.navigate(['/auth']);
                   reject(false);
                   console.error('User is not logged');
               } else {
                   resolve(true);
               }
           });
       });
   }
}
