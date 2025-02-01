import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from '../services/app.service';

@Injectable({
  providedIn: 'root'
})
export class SubsAuthGuard implements CanActivate, CanActivateChild {
  public userInfo = JSON.parse(localStorage.getItem('userInfo')) || {}
  constructor(private app: AppService, private router: Router){}

  async canActivate(){
    let subsAlready = await this.app.subsAlready()
    // console.log("not authenticated for subs", subsAlready)
    if(subsAlready){
      return true;
    }
    this.router.navigate(['pricing', this.userInfo.id]);
    return false;
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }

}
