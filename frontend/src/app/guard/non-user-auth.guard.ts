import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from '../services/app.service';

@Injectable({
  providedIn: 'root'
})
export class NonUserAuthGuard implements CanActivate {
  constructor(private app: AppService, private router: Router){}

  // canActivate(
  //   route: ActivatedRouteSnapshot,
  //   state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
  //   return true;
  // }
  canActivate(){
    if(this.app.urlChange()){
      return true;
    }
    // console.log("not authenticated for URL")
    // this.router.navigate(['evaluate-x-ray']);
    return false;
  }

}
