import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { UserService } from './user.service';
import { NgxSpinnerService } from 'ngx-spinner';
// import { FormGroup } from '@angular/forms';



@Injectable({
  providedIn: 'root'
})
export class AppService {

  public userInfo = JSON.parse(localStorage.getItem('userInfo')) || {}
  public accuracySys: any = 0;
  public accuracySysDent: any = 0;

  private windowScreen = new BehaviorSubject(window.innerWidth);
  currentWindowScreen = this.windowScreen.asObservable();

  private userInfoToken = new BehaviorSubject(this.userInfo.token);
  currentUserInfoToken = this.userInfoToken.asObservable();

  updateUserInfoToken(token: any){
    this.userInfoToken.next(token);
  }

  updateWindowScreen(msg: any){
    this.windowScreen.next(msg)
    // // console.log(msg)
  }

  private cavitiesDetectedAI = new BehaviorSubject(452983)
  currentCavitiesDetectedAI = this.cavitiesDetectedAI.asObservable();

  private accuracyPer = new BehaviorSubject(this.accuracySys)
  currentAccuracy = this.accuracyPer.asObservable();

  private accuracyPerDent = new BehaviorSubject(this.accuracySysDent)
  currentAccuracyDent = this.accuracyPerDent.asObservable();

  private approvalStageMessage = new BehaviorSubject(false);
  currentApprovalStageMessage = this.approvalStageMessage.asObservable();

  private forImage = new BehaviorSubject({})
  currentApprovalStageImage = this.forImage.asObservable();


  constructor(private router: Router,
    private UserService: UserService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute) {}

  private getUrl = new BehaviorSubject(false)

  currentUrl = this.getUrl.asObservable();

  getToken(){
    if(this.userInfo && this.userInfo.token){
      return this.userInfo.token;
    }
  }

  setToken(text: any, data: any){

    // return true;
  }

  updateCavitiesDetectedAI(num: any){
    this.cavitiesDetectedAI.next(num)
    // console.log("CAVITY UPDATE", num)
  }

  updateAccuracy(num: any){
    this.accuracyPer.next(num)
    // console.log(num)
  }

  updateAccuracyDent(num: any){
    this.accuracyPerDent.next(num)
    // console.log(num)
  }

  updateGetUrl(url: boolean){
    this.getUrl.next(url)
    // console.log(url)
  }

  userData: any = {};
  role: string;
  updateApprovalMessage(message: boolean) {
    this.approvalStageMessage.next(message)
    // console.log(message);
  }
  updateApprovalImage(message: any) {
    this.forImage.next(message)
    // console.log(message);
  }

  urlChange(){
    // console.log(this.router.url)
    if(this.router.url.split('/')[1] == 'evaluate-x-ray' && localStorage.getItem('url') == '1'){
      return true
    } else {
      return false
    }
  }

  getAccuracy(){
    this.UserService.getAccuracyOfSys().subscribe((res: any) => {
      // console.log(res, "ACCURACY ALL")
      if(res.success){
        this.accuracySys = res.accuracy
        this.updateAccuracy(res.accuracy)
        this.updateAccuracyDent(res.accuracy_dentist)
      }
    })
  }

  login(getLoginDetail) {
    // console.log(getLoginDetail);
    localStorage.setItem('userInfo', JSON.stringify(getLoginDetail['userInfo']));
    localStorage.setItem('id', getLoginDetail.userInfo.id);
    // localStorage.setItem('email', getLoginDetail.userInfo.email);
    // localStorage.setItem('role', getLoginDetail.userInfo.role);
    // localStorage.setItem('objId', getLoginDetail.userInfo.objId);
    //localStorage.setItem('isSub', getLoginDetail.userInfo.subscribed);
    localStorage.setItem('token', getLoginDetail.userInfo.token);

    //// console.log(getLoginDetail.userInfo.role)


    let jwt = getLoginDetail.userInfo.token

    let jwtData = jwt.split('.')[1]
    let decodedJwtJsonData = window.atob(jwtData)
    let decodedJwtData = JSON.parse(decodedJwtJsonData)
    this.role = decodedJwtData.role;
    //let isAdmin = decodedJwtData.admin

    //  // console.log('jwtData: ' + jwtData)
    // // console.log('decodedJwtJsonData: ' + decodedJwtJsonData)
    //// console.log('decodedJwtData: ' + this.role)


    // console.log(getLoginDetail.userInfo.token)
    /* if(decodedJwtData.role==="dentist")
     {
      if (getLoginDetail.userInfo.subscribed==true)
     {
      this.router.navigateByUrl('/');
    }
    else{ (this.router.navigateByUrl('pricing'));}
     }
     else{
      this.router.navigateByUrl('/');
     }*/
    // ! changed here
    //  this.router.navigateByUrl('/');
    
    if (getLoginDetail.userInfo.token != undefined && getLoginDetail.userInfo.token != null && getLoginDetail.userInfo.token != "") {
      this.UserService.getUserRecordById(getLoginDetail.userInfo.id).subscribe((res: any) => {
        console.log(res, res.getData[0]?.role, "*****");
        this.spinner.show();
        setTimeout(() => {
          if (res.getData[0]?.role == 'dentist') {
            let status = res.getData[0]?.subscription_details.status;
            // console.log(status)
            if (status == true || new Date(res.getData[0].subscription_details.end_date).getTime() > Date.now()) {
              this.router.navigateByUrl('/upload-xray/0');
  
            }
            //this.router.navigateByUrl('/dashboard');
  
            else {
              this.router.navigateByUrl('/pricing/' + getLoginDetail.userInfo.id);
            }
          }
          else if (res.getData[0]?.role == 'admin'){
            this.router.navigateByUrl('/dashboard');
          }
        }, 1000);
        this.spinner.hide();
        //return
      })
    }
    else {
      this.router.navigateByUrl('/login');
    }
  }
  addTripData(tripData: any) {
    localStorage.setItem('tripInfo', JSON.stringify(tripData));
  }

  logout() {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('id');
    localStorage.removeItem('i');
    localStorage.removeItem('renew_sub');
    localStorage.removeItem('patient_ID');
    // localStorage.removeItem('role');
    //localStorage.removeItem('objId');
    localStorage.removeItem('token');
    this.router.navigateByUrl('');
  }

  loggedIn() {
    return (!!localStorage.getItem("token"));
  }

  roleAdmin(){
    if(JSON.parse(localStorage.getItem("userInfo")).role == 'admin'){
      return true
    } else {
      return false
    }
  }

  pricingPage(){
    if(JSON.parse(localStorage.getItem("userInfo"))?.role == 'dentist' && !JSON.parse(localStorage.getItem("userInfo"))?.subscribed){
      return true;
    } else {
      this.UserService.getUserRecordById(localStorage.getItem("i")).subscribe((res: any) => {
        // console.log(res, res.getData[0]?.role, !res.getData[0]?.subscription_details?.status)
        if(res.getData[0]?.role == 'dentist' && !res.getData[0]?.subscription_details?.status){
          return true
        } else {
          return false;
        }
        // return true;
      })
    }
  }

  // roleOfAdmin(){

  // }

  roleDentist(){
    if(JSON.parse(localStorage.getItem("userInfo")).role == 'dentist'){
      return true
    } else {
      return false
    }
  }

  subsForDashboard(){
    // this.UserService.getUserRecordById(JSON.parse(localStorage.getItem("userInfo")).id).subscribe((res: any) => {
    //   if((JSON.parse(localStorage.getItem("userInfo")).role == 'admin') || (JSON.parse(localStorage.getItem("userInfo")).role == 'dentist' && JSON.parse(localStorage.getItem("userInfo")).subscribed) || (JSON.parse(localStorage.getItem("userInfo")).role == 'dentist' && new Date(res?.getData[0]?.subscription_details?.end_date).getTime() > Date.now())){
    //     return true;
    //   } else {
    //     return false
    //   }
    // })
    if((JSON.parse(localStorage.getItem("userInfo"))?.role == 'admin') || (JSON.parse(localStorage.getItem("userInfo"))?.role == 'dentist' && JSON.parse(localStorage.getItem("userInfo"))?.subscribed)){
      // console.log(JSON.parse(localStorage.getItem("userInfo")).role, true)
      return true;
    } else {
      // console.log(JSON.parse(localStorage.getItem("userInfo"))?.role, false)
      return false;
    }
    // || (JSON.parse(localStorage.getItem("userInfo")).role == 'dentist' && new Date(res?.getData[0]?.subscription_details?.end_date).getTime() > Date.now())
  }

  async subsAlready(){
    // let subsNotEnded;
    return await new Promise((res,rej) => {
      this.UserService.getUserRecordById(JSON.parse(localStorage.getItem("userInfo")).id).subscribe((result: any) => {
        // if(new Date(res?.getData[0]?.subscription_details?.end_date).getTime() > new Date('2023/06/14').getTime()){
        //   // console.log(subsNotEnded, true)
        //   subsNotEnded = true
        // } else {
        //   subsNotEnded = false
        // }
        // console.log(result, "auth")
        if(JSON.parse(localStorage.getItem("userInfo")).subscribed || new Date(result?.getData[0]?.subscription_details?.end_date).getTime() > Date.now()){
          res(true)
        } else {
          res(false)
        }
      })
    })

    // let id = JSON.parse(localStorage.getItem("userInfo")).id
    // await this.UserService.getUserRecordById(id).subscribe((res: any) => {
    //   // console.log(res)
    //   if(res.getData[0]?.subscription_details.status){
    //     return true
    //   } else {
    //     return false
    //   }
    // })
  }

  async isSubscribed() {

    let jwt = localStorage.getItem('token');
    let jwtData = jwt.split('.')[1]
    let decodedJwtJsonData = window.atob(jwtData)
    let decodedJwtData = JSON.parse(decodedJwtJsonData)
    this.role = decodedJwtData.role;
    // console.log("role", this.role)
    if (this.role === 'dentist') {
      // console.log("inside if")
      const id = localStorage.getItem('id');
      const d = await this.UserService.getUserRecordById(id).subscribe((res: any) => {
        // console.log(res)
        if (res.success) {
          this.userData = res.getData;
          // console.log("iff", !!this.userData[0]?.subscription_details.status, this.userData[0]?.subscription_details.status)
          return (!!this.userData[0]?.subscription_details.status);
        }
      })
    }
    else {
      // console.log("else")
      return true;
    }
  }
  private _listners = new Subject<any>();

  listen(): Observable<any> {
    return this._listners.asObservable();
  }

  filter(filterBy: string) {
    this._listners.next(filterBy);
  }
}
