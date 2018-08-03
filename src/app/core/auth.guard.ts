import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {AuthService} from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService:AuthService, private router: Router){
    
  }
  canActivate(){
    if(Boolean(this.authService.getCurrentlyUser())){
       return true;
    }
    else {
      this.router.navigate(['/auth']);
      return false;
    }
  }
  
}
