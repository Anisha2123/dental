import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from '../services/app.service';

@Injectable({
  providedIn: 'root'
})
export class UserRolesAuthGuard implements CanActivate, CanActivateChild {

  constructor(private app: AppService, private router: Router){}

  canActivate(){
    if(this.app.roleAdmin()){
      return true;
    }
    // console.log("not authenticated for admin")
    this.router.navigate(['login']);
    return false;
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }

}
