import Swal from 'sweetalert2';
import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
   userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  curPass: string;
  newPass: string;
  cnfPass: string;
  ALPHA_NUMERIC_REGEX = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=\S+$).{7,20}$/;

  constructor(private userService: UserService){}

  ngOnInit(){

  }
  onCurPass(event : any){
    this.curPass = (<HTMLInputElement>event.target).value.trim();
  }
  onNewPass(event: any){
    this.newPass = (<HTMLInputElement>event.target).value.trim();
  }
  onCnfPass(event: any){
    this.cnfPass = (<HTMLInputElement>event.target).value.trim();
  }
  setNew(){
    const data={
      id:this.userInfo.id,
      password:this.curPass,
      newPassword: this.newPass,
      cnfPassword: this.cnfPass


    }
    // console.log(this.curPass,this.newPass,this.cnfPass)
    if(this.curPass !== undefined && this.newPass !== undefined && this.cnfPass !==undefined ){
      if (!this.ALPHA_NUMERIC_REGEX.test(this.cnfPass) || !this.ALPHA_NUMERIC_REGEX.test(this.cnfPass) || this.cnfPass.length < 7 || this.newPass.length < 7) {
        Swal.fire({
          text: 'Password must be contain atleast 7 characters and atleast one letter and one number',
          icon: 'warning'
        });
        return false;
      }
      else if (this.newPass !== this.cnfPass) {
        Swal.fire({
          text: 'The password confirmation does not match, please try again',
          icon: 'error'
        });
        return false;
      }
      else
      {
        this.userService.resetPassword(data).subscribe((res:any) => {
        // console.log("Password changes",res);
        if(res.success){
          Swal.fire({
            text: 'Password changed successfully',
            icon: 'success'
          });
          document.getElementById('close')?.click();
          return true;
        } else {
          Swal.fire({
            text: res.message,
            icon: 'error'
          });
        }
       // this.router.navigateByUrl("/login")
      })
    }


    }
    else{
      Swal.fire({
        text: 'Please enter the password',
        icon: 'error'
      });
      return false;

    }
    ($("#ResetPassModal") as any).modal("hide");
  }
}
