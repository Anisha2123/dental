import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AppService } from '../services/app.service';

@Injectable({
  providedIn: 'root'
})

export class SubscribeAuthGuard implements CanActivate {
  userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  constructor(private app : AppService,
    public router :Router){}




  canActivate(){
    if(this.app.isSubscribed()){
      return true;
    }
    // console.log("not authenticated for isSubs")
    this.router.navigate(['login']);

    return false;
  }



}
