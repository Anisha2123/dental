import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from '../services/app.service';


@Injectable({
  providedIn: 'root'
})
export class PricingGuardGuard implements CanActivate, CanActivateChild {

  constructor(private app: AppService, private router: Router){}

  canActivate(){
    if(this.app.pricingPage()){
      return true;
    }
    // console.log("not authenticated for pricing page")
    this.router.navigate(['upload-xray/0']);
    return false;
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }

}
