import { Component } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service'; 
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-widgets-user-dropdown',
  templateUrl: './widgets-user-dropdown.component.html',
  styleUrls: ['./widgets-user-dropdown.component.scss']
})
export class WidgetsUserDropdownComponent {
  noOfXray: any=0;
  userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  noOfAiCavity: any=0;
  count: any =0;
  planDetail: any;
  newPass: string;
  cnfPass: string;
  curPass: string;
  ALPHA_NUMERIC_REGEX = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=\S+$).{7,20}$/;
  noOfXrayEval: any=0;
  public URL: boolean;
  constructor(
   // private changeDetectorRef: ChangeDetectorRef,
    private userService: UserService,
    public router :Router,
    private appService: AppService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    //this.setData();
    this.dashboard();
    // console.log(this.userInfo);
    this.appService.currentUrl.subscribe((url) => {
      // console.log(url)
      this.URL = url
    })
  }
  changeUrl(){
    // console.log(this.route.snapshot.url[0].path)
    if(this.URL){
      Swal.fire({
        title: 'Are you sure?',
        text: "Your progress will be lost!",
        //icon: 'warning',
        imageUrl: '../../../../assets/images/warning.png',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirm <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 3c-4.625 0-8.442 3.507-8.941 8.001H10v-3l5 4-5 4v-3H3.06C3.56 17.494 7.376 21 12 21c4.963 0 9-4.037 9-9s-4.037-9-9-9z"></path></svg>',
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            title: 'Success!',
            text: 'You Have Discarded The Image Successfully',
            // icon: 'success',
            imageUrl: '../../../../assets/images/success.png',
          });
              this.router.navigateByUrl('/dashboard');

          // this.userService.deleteXrayByID(id, {name: name}).subscribe((res: any) => {
          //   // console.log(res)
          //   if(res.success){
          //     this.router.navigateByUrl('/upload-xray/0');
          //   } else {
          //     Swal.fire({
          //       text: "Internal server error, image can't be deleted.",
          //       icon: 'error',
          //     });
          //   }
          // })
        }
      });
    }
  }
  dashboard(){
    // this.userService.getUserRecordById(this.userInfo.id).subscribe((res: any) => {
    //   // console.log(res)
    // })
    this.spinner.show();
    this.userService.noOfXrayByID(this.userInfo.id).subscribe((res:any)=>
    {
      if(res.success){
        this.spinner.hide();
       this.noOfXray=res.getData;
       // console.log("noOfXray",this.noOfXray)
      }else{this.spinner.hide()}
    })
    this.spinner.show();
    this.userService.noOfXrayEvalByID(this.userInfo.id).subscribe((res:any)=>
    {
      if(res.success){
       this.noOfXrayEval=res.getData;
       this.spinner.hide()
       // console.log("noOfXray",this.noOfXrayEval)
      }else{this.spinner.hide()}
    })
    this.spinner.show();
    this.userService.noOfCavityByAI(this.userInfo.id).subscribe((res:any)=>
    {
      if(res.success){
       this.noOfAiCavity=res.getData;
       this.spinner.hide()
       // console.log("noOfXray",this.noOfAiCavity)
      }else{this.spinner.hide()}
      for(let i=0;i<this.noOfAiCavity.length;i++)
      {
        if(this.noOfAiCavity[i].evaluation?.length > 0){
             let n=this.noOfAiCavity[i].evaluation[0]?.ai_identified_cavities?.color_labels?.length
          if(n==undefined)
       {
           // console.log(n
          // ,"***")

        }
        else{
          this.count= this.count+this.noOfAiCavity[i].evaluation[0]?.ai_identified_cavities?.color_labels.length
          // console.log(this.count)
        }
      }
    }
     // console.log(this.count)
    })
    this.spinner.show();
    this.userService.getUserPlanById(this.userInfo.id).subscribe((res:any)=>
    {
      if(res.success){
      this.spinner.hide();
       this.planDetail=res.getData;
       ///console.log("planDetail", this.planDetail, this.planDetail?.subscription_details?.subscription_id?.plan_name)
      }else{
        this.spinner.hide();
      }
    })
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
  }

}
