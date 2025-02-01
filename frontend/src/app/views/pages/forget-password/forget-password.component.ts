import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { of, catchError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {
  title = 'ARTI - Forgot Password';
  display: any = `00:00`;
  public resetState = false;
  setNewPass = false;
  timePassed = false;
  emailReset = '';
  data: '';
  otp = '';
  newPass = "";
  cnfPass = "";
  public resetPass: boolean = false;
  ALPHA_NUMERIC_REGEX = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=\S+$).{7,20}$/;
  constructor(private apiService: UserService, public router : Router,private spinner: NgxSpinnerService, private titleService: Title,){
    titleService.setTitle(this.title);
  }
  onEmailReset(event: any){
    this.emailReset = (<HTMLInputElement>event.target).value.trim();
  }
  onOTP(event: any){
    this.otp = (<HTMLInputElement>event.target).value.trim();
  }
  onNewPass(event: any){
    this.newPass = (<HTMLInputElement>event.target).value.trim();
  }
  onCnfPass(event: any){
    this.cnfPass = (<HTMLInputElement>event.target).value.trim();
  }
  onlyNumberKey(evt: KeyboardEvent) {
    // Only ASCII character in that range allowed
    let ASCIICode = (evt.which) ? evt.which : evt.keyCode;
    return (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) ? false : true;
  }
  // time = 5;
  handleReset(){
    this.spinner.show();
    const testBy = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    // // console.log(this.emailReset);
    // for(let i  = this.time; i >= 0; i--){
      //   setTimeout(function () {
        //     // console.log(i);
        //   },(this.time - i) * 1000);
        // }
    if(this.emailReset !== ''){

      let isValid = testBy.test(this.emailReset.toLowerCase().trim());
      setTimeout(() => {
        this.spinner.hide();
      }, 2000);
      if (!isValid) {
        Swal.fire({
          text: 'Please enter valid email',
          icon: 'warning'
        });
        return false;
      }
      this.resetPass = true;
      (<HTMLInputElement>document.getElementById('email')).disabled = true;

      this.apiService.forgotPassword({email: this.emailReset.toLowerCase().trim()}).pipe(
        catchError(err => of([err]))
      ).subscribe((res: any) => {
        this.resetPass = false;
        // console.log(res);

        if(res.data){
          setTimeout(() => {
            this.spinner.hide();
          }, 2000);
          // console.log(`Email done! ${res.otp} is the OTP`);
          this.data = res.data;
          this.resetState = true;
          this.timePassed = false;
          this.timer(10);
        } else {
        (<HTMLInputElement>document.getElementById('email')).disabled = false;
          Swal.fire({
            text: `An account with email address ${this.emailReset} does not exists, please register.`,
            icon: 'error'
          });
          return false;
        }
      });

    } else if(this.emailReset.trim() == '' || this.emailReset == '') {
      // console.log("email not entered");
      Swal.fire({
        text: 'Please enter email',
        icon: 'warning'
      });
      return false;
    }
    // console.log(this.resetState,"***");
  }
  // countDown() {
  //   for(let i  = this.time; i >= 0; i--){
  //     setTimeout(function () {
  //       // console.log(i);
  //     },(this.time - i) * 1000);
  //   }
  // }
  handleClick(){
    this.resetState = false;
  }
  otpVerify(){
    if(this.otp !== ''){
      try {
        this.apiService.VerifyingOTP({email: this.emailReset.toLowerCase().trim(), token: this.data, otp: this.otp}).pipe(
          catchError(err => of([err]))
        ).subscribe((res:any) => {
          if(res.success){
            // console.log("OTP done!", res.success);
            this.setNewPass = true;
            // this.timer(null);
          } else {
            Swal.fire({
              text: 'Incorrect otp, please try again',
              icon: 'error'
            });
            return false;
          }
        })
      } catch (e) {
        // console.log(e);
      }
    } else if(this.otp == '') {
      Swal.fire({
        text: 'Please enter otp',
        icon: 'warning'
      });
      return false;
    }
  }
  setNew(){
    if(this.newPass !== "" && this.cnfPass !== "" )
    { // console.log("ifff")
      if (this.newPass !== this.cnfPass) {
        Swal.fire({
          text: 'The password confirmation does not match, please try again',
          icon: 'error'
        });
        return false;
      }
      else if (!this.ALPHA_NUMERIC_REGEX.test(this.cnfPass) || !this.ALPHA_NUMERIC_REGEX.test(this.cnfPass) || this.cnfPass.length < 7 || this.newPass.length < 7) {
        Swal.fire({
          text: 'Password must be contain atleast 7 characters and atleast one letter and one number',
          icon: 'warning'
        });
        return false;
       }
        else { this.apiService.setNewPassword({email: this.emailReset.toLowerCase().trim(), newPass: this.newPass, cnfPass: this.cnfPass}).subscribe((res:any) => {
        // console.log("Password changes");
        this.router.navigateByUrl("/login")
      })}
    }
    else{
      Swal.fire({
        text: 'Please enter the password',
        icon: 'error'
      });
      return false;

    }
    // } else if (!this.ALPHA_NUMERIC_REGEX.test(this.cnfPass) || !this.ALPHA_NUMERIC_REGEX.test(this.cnfPass) || this.cnfPass.length < 7 || this.newPass.length < 7) {
    //   Swal.fire({
    //     text: 'Password must be contain atleast 7 characters and atleast one letter and one number',
    //     icon: 'warning'
    //   });
    //   return false;
    // } else if (this.newPass !== this.cnfPass) {
    //   Swal.fire({
    //     text: 'The password confirmation does not match, please again',
    //     icon: 'error'
    //   });
    //   return false;
    // }
  }
  public timer(minute: any) {
    // let minute = 1;
    if(this.resetState){

    }


    let seconds: number = minute * 60;
    let textSec: any = '0';
    let statSec: number = 60;

    const prefix = minute < 10 ? '0' : '';

    const timer = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = '0' + statSec;
      } else textSec = statSec;

      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;
      // // console.log(this.display);
      // // console.log(`${prefix}${Math.floor(seconds / 60)}`);

      if(`${prefix}${Math.floor(seconds / 60)}` == `00` && textSec == `00`){
        // console.log("worked");
        this.timePassed = false;
      }

      // if(textSec == 0){

      // }

      if (seconds == 0) {
        this.timePassed = true;
        // console.log('finished', this.timePassed);
        Swal.fire({
          text: 'OTP expired, please try again',
          icon: 'error'
        });
        this.router.navigateByUrl("/forgot-password")
        clearInterval(timer);
      }
      // // console.log(this.setNewPass);
      if(this.setNewPass){
        clearInterval(timer);
      }
    }, 1000);
  }

  ngOnInit(): void {

    // // console.log(this.resetState);
  }
  onSomeActionReset(event: any){
    if(event.key == "Enter"){
      this.handleReset()
    }
  }
  onSomeActionOTP(event: any){
    if(event.key == "Enter" && this.resetState){
      this.otpVerify()
    }
  }
  onSomeActionNew(event: any){
    if(event.key == "Enter" && this.setNewPass){
      this.setNew()
    }
  }
}
