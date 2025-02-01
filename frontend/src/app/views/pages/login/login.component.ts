import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { UserService } from "../../../services/user.service";
import { AppService } from "../../../services/app.service";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  title = 'ARTI - Login';
  public userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  public loginForm: FormGroup;
  public isAuthLoading = false;
  public statusSubs: any;
  constructor(
    private renderer: Renderer2,
    private toastr: ToastrService,
    private appService: AppService,
    private apiService: UserService,
    public router: Router,
    private titleService: Title,
  ) {
    titleService.setTitle(this.title);
  }
  regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  ngOnInit() {
    this.renderer.addClass(document.querySelector('app-root'), 'login-page');
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required]),
      password: new FormControl(null, Validators.required),
    });
    // this.appService.currentApprovalStageMessage.subscribe(msg => this. = msg);
    if (localStorage.getItem('token')) {
      this.router.navigateByUrl("/dashboard")
    }
    // let p_data = {
    //   token: 'A21AAIkrNT4uw6k5IbT5mFWZT0Fefx_kDg767QqDDf9hP-L1hkAiINAtTtAgC6B6yu-KHHMu3_Ovs4pDRtONOYULiY9ggR2Mg',
    //   prod_id: 'PROD-2SV05090KF783042A'
    // }
    // localStorage.setItem('p-data', JSON.stringify(p_data))
    // ! to create productID
    // this.apiService.payPalTokenGen(null).subscribe((res: any) => {
    //   // console.log(res)
    //   let data = {
    //     "name": "ARTI",
    //     "type": "SERVICE",
    //   }
    //   this.apiService.paypalGenProdID(data, res.access_token).subscribe((res: any) => {
    //     // console.log(res)
    //   })
    // })
    // this.apiService.paypalDataByProdID('PROD-2SV05090KF783042A').subscribe((res: any) => {
    //   // console.log(res)
    // })
  }

  onSomeAction(event: any) {
    if (event.key == "Enter") {
      this.login()
    }
  }

  login() {
    // console.log(this.loginForm.value.email)
    if (this.loginForm.valid) {

      const testBy = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      let isValid = testBy.test(this.loginForm.get("email").value.toLowerCase());
      if (!isValid) {

        Swal.fire({
          text: 'Please enter valid email',
          icon: 'warning'
        });
        return false;
      }
      // console.log(this.loginForm.value.email)
      this.isAuthLoading = true;
      let loginData = {
        email: this.loginForm.get("email").value.toLowerCase(),
        password: this.loginForm.get("password").value
      };
      // this.appService.updateApprovalMessage(loginData)
      this.apiService.onLogin(JSON.stringify(loginData)).subscribe((result: any) => {
        // console.log(result)
        // let id= result.userInfo.id;
        if (result.success) {
          localStorage.setItem('userInfo', JSON.stringify(result['userInfo']));
          localStorage.setItem('id', result.userInfo.id);
          localStorage.setItem('i', result.userInfo.id);

          localStorage.setItem('token', result.userInfo.token);
          this.appService.updateUserInfoToken(result.userInfo.token);
          // console.log(result);
          // this.apiService.payPalTokenGen(null).subscribe((res: any) => {
          //   if (res.access_token) {
          //     localStorage.setItem('p-token', res.access_token)
          //   }
          // })
          // console.log(result.userInfo.subscribed, result.userInfo.id)
          let id = result.userInfo.id;
          this.apiService.getUserRecordById(id).subscribe((res: any) => {
            // console.log(res, "*****");
            if (res.getData[0]?.role == 'dentist') {
              let status = res.getData[0]?.subscription_details.status;
              this.statusSubs = res.getData[0]?.subscription_details.status;
              // console.log(status)
              if (status == true || new Date(res.getData[0].subscription_details.end_date).getTime() > Date.now()) {
                this.appService.login(result);
              }
              else {

                this.router.navigateByUrl("/pricing/" + result.userInfo.id);

                // [routerLink]="'/dentist-profile/'+user._id"
              }

            }
            else {
              this.appService.login(result);
            }

          })

          //this.toastr.success(result.message);
          //
        }

        else {
          this.isAuthLoading = false;
          //this.toastr.error(result.message);
          Swal.fire({
            text: result.message,
            icon: 'error',
          });
        }
      });
    }
    if (
      this.loginForm.value.email == undefined ||
      this.loginForm.value.email.trim() == ''
    ) {
      Swal.fire({
        text: 'Please enter email',
        icon: 'warning'
      });
      return false;
      // this.toastr.error('Please enter plan name');
      // return false;
    }
    if (!this.regex.test(this.loginForm.value.email)) {
      Swal.fire({
        text: 'Please enter valid email',
        icon: 'warning'
      });
      return false;
      // this.toastr.error('Please enter plan name');
      // return false;
    }
    if (
      this.loginForm.value.password == undefined ||
      this.loginForm.value.password.trim() == ''
    ) {
      Swal.fire({
        text: 'Please enter password',
        icon: 'warning'
      });
      return false;
      // this.toastr.error('Please enter plan name');
      // return false;
    }
  }

  ngOnDestroy() {
    this.renderer.removeClass(document.querySelector('app-root'), 'login-page');
  }

}
