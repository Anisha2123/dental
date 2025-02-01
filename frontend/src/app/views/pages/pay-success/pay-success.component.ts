import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from "ngx-spinner";


@Component({
  selector: 'app-pay-success',
  templateUrl: './pay-success.component.html',
  styleUrls: ['./pay-success.component.scss']
})
export class PaySuccessComponent implements OnInit {
  public id: any = localStorage.getItem('i') || '';
  public userId: any;
  public token: any = localStorage.getItem('token');
  public btnStatus: boolean = false;
  title = 'ARTI';
  public payment_status: any;
  public show_text: any;
  public subs_detail: any;
  public userInfo: any = JSON.parse(localStorage.getItem('userInfo')) || {};
  renew_subs: boolean;
  statusSubs: any;
  constructor(private userService: UserService, private appService: AppService, private router: Router, private titleService: Title, private spinner: NgxSpinnerService, private route: ActivatedRoute,) {
    titleService.setTitle(this.title);
  }
  ngOnInit(): void {
    // console.log(this.userInfo)
    this.payment_status = this.route.snapshot.paramMap.get('payment_status');
    this.userId = this.route.snapshot.paramMap.get('dentist_id');
    // console.log(this.payment_status, this.userId)
    this.spinner.show();
    if (this.payment_status == 'success') {
      this.userInfo.subscribed = true;
      // console.log(this.userInfo)
      localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
      this.show_text = 'Please waiting, You are being redirected to home page...';
      if (localStorage.getItem('renew_sub')) {
        this.renew_subs = true;
        this.subs_detail = JSON.parse(localStorage.getItem('renew_sub'));
        // console.log("the renew sub")
      } else if (localStorage.getItem('sub')) {
        // console.log("the new sub")
        this.renew_subs = false;
        this.subs_detail = JSON.parse(localStorage.getItem('sub'));
      } else {
        // console.log('no subs')
      }
    } else if (this.payment_status == 'failure') {
      this.show_text = 'Please waiting, You are being redirected to pricing page...';
      // console.log(this.renew_subs)
      this.userService.handleFailedTransaction({ id: this.userId }).subscribe((res: any) => {
        // console.log(res)
        if (res.success) {

        }
      })
      setTimeout(() => {
        this.spinner.hide()
        if (localStorage.getItem('renew_sub')) {
          this.renew_subs = true;
          this.subs_detail = JSON.parse(localStorage.getItem('renew_sub'));
          // console.log("the renew sub")
          this.router.navigateByUrl('/renew-sub/' + this.userId);
        } else if (localStorage.getItem('sub')) {
          // console.log("the new sub")
          this.renew_subs = false;
          this.subs_detail = JSON.parse(localStorage.getItem('sub'));
          this.router.navigateByUrl('/pricing/' + this.userId);
        }
      }, 4000)
    }
    // setTimeout(() => {
    //   this.spinner.hide();
    // }, 3000)
    this.onLogin();
  }
  onLogin() {
    if (this.payment_status == 'failure') {
      // console.log(this.renew_subs)
      setTimeout(() => {
        this.spinner.hide()
        if (this.renew_subs) {
          this.router.navigateByUrl('/renew-sub/' + this.userId);
        } else {
          this.router.navigateByUrl('/pricing/' + this.userId);
        }
      }, 4000)
    } else if (this.payment_status == 'success') {
      if (this.renew_subs) {
        this.userService.getSubscriptionRenew(this.subs_detail, this.userId).subscribe((res: any) => {
          // console.log(res)
          if (res.success && this.renew_subs) {
            localStorage.removeItem('renew_sub')
          } else if (res.success && !this.renew_subs) {
            localStorage.removeItem('sub')
          }
        })
      } else {
        this.userService.getSubscription(this.subs_detail, this.userId).subscribe((res: any) => {
          // console.log(res)
          if (res.success) {
            this.userInfo.subscribed = true;
            // console.log(this.userInfo)
            localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
          }
          if (res.success && !this.renew_subs) {
            localStorage.removeItem('renew_sub')
          } else if (res.success && this.renew_subs) {
            localStorage.removeItem('sub')
          }
        })
      }
      // console.log(this.subs_detail)
      this.userService.getUserRecordById(this.userId).subscribe((res: any) => {
        // console.log(res, "*****");
        if (res.success == false) {
          // alert("Please Login")
          Swal.fire({
            text: "Please login",
            icon: 'warning',
          });
        }
        if (res.getData[0]?.role == 'dentist') {
          let status = res.getData[0]?.subscription_details.status;
          this.statusSubs = res.getData[0]?.subscription_details.status;
          // console.log(status, res.getData[0]?.subscription_details.status)
          let userInfo = {
            id: this.id,
            role: res.getData[0]?.role,
            subscribed: true,
            token: this.token
          }
          localStorage.setItem('userInfo', JSON.stringify(userInfo))
          // console.log("resmove this late")
          this.btnStatus = true;
          setTimeout(() => {
            this.spinner.hide();
            this.router.navigateByUrl('/upload-xray/0');
          }, 4000)
          // if (status == true || new Date(res.getData[0].subscription_details.end_date).getTime() > Date.now()) {
          // this.appService.login(result);
          // }
          // else {
          // localStorage.setItem('userInfo', JSON.stringify(result['userInfo']));
          // localStorage.setItem('id', result.userInfo.id);
          // localStorage.setItem('token', result.userInfo.token);
          // this.router.navigateByUrl("/pricing/" + result.userInfo.id);
          // [routerLink]="'/dentist-profile/'+user._id"
          // }

        }
        else {
          // this.appService.login(result);
        }
      })
    }
  }
  // handleClick() {
  //   this.router.navigateByUrl('/dashboard');
  // }
}
