import { Component, Input, HostListener } from '@angular/core';
import { AppService } from 'src/app/services/app.service';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { navItems, navItemsUser } from './_nav';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
})

export class DefaultLayoutComponent {
  userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  addSuperForm: FormGroup;
  userData: any = {};
  all_subData: any = []
  userID: any;
  public planDetail: any;
  public allcountries: any;
  public dentistId: any = localStorage.getItem('id');
  public stateList: any = '-Select State-';
  public allstates: any;
  country: any;
  end_date: any;
  curPass: string;
  newPass: string;
  cnfPass: string;
  stripesubID: any;
  ALPHA_NUMERIC_REGEX = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=\S+$).{7,20}$/;
  // planData: any = {};
  public isVisible: boolean = true
  public userDetail = this.userInfo;
  public navItems = navItems;
  public navItemsUser = navItemsUser;
  public role: string;
  public URL: string;
  public changeUrl: boolean = false;
  public windowWidth: boolean = false;
  public windowInnerWidth: any;
  localHost: any;
  paypal_user_ID: any;
  filterLink: any;


  constructor(private appService: AppService, private router: Router, private route: ActivatedRoute, private userService: UserService, private formBuilder: FormBuilder, private spinner: NgxSpinnerService) {
    this.URL = this.router.url.split('/')[0]
    this.addSuperForm = this.formBuilder.group({})
    this.localHost = environment.LOCAL_HOST;
  }
  ngOnInit() {
    console.log('Checkkkkkkk')
    this.appService.getAccuracy()
    // console.log(window.innerWidth);
    this.appService.currentWindowScreen.subscribe((res: any) => {
      // // console.log(res)
      this.windowInnerWidth = res;
    })
    if (window.innerWidth < 768) {
      this.windowWidth = true;
    } else {
      this.windowWidth = false;
    }

    this.appService.currentUrl.subscribe((url: boolean) => {
      this.changeUrl = url
    })
    // console.log(this.userDetail, this.changeUrl, "URL")
    let jwt = this.userDetail.token
    // console.log(this.router.url.split('/')[0])
    let jwtData = jwt.split('.')[1]
    let decodedJwtJsonData = window.atob(jwtData)
    let decodedJwtData = JSON.parse(decodedJwtJsonData);

    this.role = decodedJwtData.role;
    // this.addSuperForm = new FormGroup({
    //   firstname: new FormControl(),
    //   lastname: new FormControl(),
    //   contact: new FormControl(),
    //   email: new FormControl(),
    //   address1: new FormControl(),
    //   address2: new FormControl(),
    //   city: new FormControl(),
    //   country: new FormControl(),
    //   state: new FormControl('', Validators.required),
    //   zip: new FormControl(),
    //   // age: new FormControl(),
    //   license_no: new FormControl(),

    //   //user_role: new FormControl(),
    // });
    // this.addSuperForm = this.formBuilder.group({
    //   first_name: ['', [Validators.required]],
    //   last_name: ['', [Validators.required]],
    //   contact_number: ['', [Validators.pattern('[- +()0-9]{10,12}')]],
    //   email: [
    //     '',
    //     [Validators.pattern('^([a-zA-Z0-9\.-]+)@([a-zA-Z0-9-]+).[a-zA-Z]{2,4}$')],
    //   ],
    //   address1: ['', [Validators.required]],
    //   address2: ['', [Validators.required]],
    //   city: ['', [Validators.required]],
    //   state: ['-Select State-', [Validators.required]],
    //   country: ['-Select Country-', [Validators.required]],
    //   pincode: ['', [Validators.pattern('[- +()0-9]{10,12}')]],
    //   // age: ['', [Validators.required]],
    //   license_no: ['', [Validators.required]],
    // });
    this.editadmin(this.dentistId);
    
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize() {
    // this.getScreenWidth = window.innerWidth;
    // this.getScreenHeight = window.innerHeight;
    // // console.log(window.innerWidth)
    this.appService.updateWindowScreen(window.innerWidth);
    if (this.windowInnerWidth < 768 || window.innerWidth < 768) {
      this.windowWidth = true;
    } else {
      this.windowWidth = false;
    }
  }

  receiveMessage(event: boolean) {
    this.isVisible = event;
    // // console.log(this.isVisible);
  }
  onlyNumberKey(evt: KeyboardEvent) {
    // Only ASCII character in that range allowed
    let ASCIICode = (evt.which) ? evt.which : evt.keyCode;
    return (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) ? false : true;
  }
  stateByCountry(e: any) {
    // console.log(e.target.value)
    this.userService.getStateByCountries({ name: e.target.value }).subscribe((res: any) => {
      // console.log(res.getData[0].regions, this.stateList)
      this.stateList = "-Select State-"
      this.addSuperForm.controls['state'].setValue("-Select State-");
      this.allstates = res.getData[0].regions
      // // console.log(this.allstates)
    })
  }
  // planDetails(id) {
  //   // console.log(id, "idd")
  //   for (let i = 0; i < this.all_subData.length; i++) {
  //     if (this.all_subData[i]._id == id) {
  //       this.planDetail = this.all_subData[i]
  //     }
  //     // console.log(this.planDetail, "detail")
  //   }
  // }
  allCountryList() {
    this.userService.getCountries().subscribe((res: any) => {
      // // console.log(res.getData)
      this.allcountries = res.getData
    })
  }
  // updateUser(){
  //   // console.log("UPDATED")
  // }
  // resetUser(){
  //   // console.log("RESET")
  // }
  // onCurPass(event : any){
  //   this.curPass = (<HTMLInputElement>event.target).value.trim();
  // }
  // onNewPass(event: any){
  //   this.newPass = (<HTMLInputElement>event.target).value.trim();
  // }
  // onCnfPass(event: any){
  //   this.cnfPass = (<HTMLInputElement>event.target).value.trim();
  // }
  editadmin(id) {
    this.allCountryList()
    this.userService.getUserRecordById(id).subscribe((res: any) => {
      console.log(res, "*****");
      localStorage.setItem('userRecord', JSON.stringify(res.getData[0]))
      // console.log(res.getData[0].first_name, res.getData[0].last_name, res.getData[0].contact_number);
      this.userData = res.getData;
      this.end_date = this.userData[0].subscription_details.end_date;
      // console.log(this.userData[0].subscription_details.end_date, "***")
      let d = new Date()
      this.planDetail = res.getData[0]
      console.log(this.planDetail.subscription_details.stripepaymentID, "PLANDETAILS", this.planDetail)
      this.stripecheckoutdetails()
      // this.userService.getSubPlanById(this.userData[0].subscription_details.subscription_id).subscribe((resp: any) => {
      //   // console.log(resp)
      //   if (resp.success) {
      //     this.planDetail = resp.getData;
      //   }
      // })
      if (res.success) {
        this.addSuperForm.patchValue({
          first_name: res.getData[0].first_name,
        });

        this.addSuperForm.patchValue({
          last_name: res.getData[0].last_name,
        });

        this.addSuperForm.patchValue({
          contact_number: res.getData[0].contact_number,
        });

        this.addSuperForm.patchValue({
          email: res.getData[0].email,
        });

        this.addSuperForm.patchValue({
          address1: res.getData[0].address1,
        });

        this.addSuperForm.patchValue({
          address2: res.getData[0].address2,
        });
        this.addSuperForm.patchValue({
          city: res.getData[0].city,
        });
        this.addSuperForm.patchValue({
          country: res.getData[0].country,
        });
        this.addSuperForm.controls['country'].setValue(res.getData[0].country)
        this.addSuperForm.patchValue({
          state: res.getData[0].state,
        });
        this.addSuperForm.get('state').setValue(res.getData[0].state)
        this.addSuperForm.patchValue({
          pincode: res.getData[0].pincode,
        });
        this.addSuperForm.patchValue({
          license_no: res.getData[0].license_no,
        })
        this.stateList = res.getData[0].state
        // console.log(res.getData[0].state)
      }
    });
  }

  stripecheckoutdetails(){
    console.log('ddddd',this.planDetail.subscription_details.stripepaymentID)
    this.userService.getUsercheckoutdetails(this.planDetail.subscription_details.stripepaymentID).subscribe((res: any) => {
      ///console.log(res, "*****")
      if(res.success === true){
         this.stripesubID = res.data.subscription
         console.log(this.stripesubID)
      }else{
        Swal.fire({
          text: res.message,
          icon: 'error',
        });
      }  
    });

  }
  handleRenew(id) {
    console.log(id)
    return
    this.userService.getSubPlanById(id).subscribe((resp: any) => {
      // console.log(resp.getData[0].paypalID);
      if (resp.success) {
        let data = {
          "plan_id": resp.getData[0].paypalID,
          // "start_time": "2018-11-01T00:00:00Z",
          // "quantity": "20",
          "auto_renewal": true,
          "shipping_amount": {
            "currency_code": "USD",
            "value": "0"
          },
          "subscriber": {
            "name": {
              "given_name": "John",
              "surname": "Doe"
            },
            "email_address": "sb-zhqmo25396320@personal.example.com",
            "shipping_address": {
              "name": {
                "full_name": "John Doe"
              },
              "address": {
                "address_line_1": "2211 N First Street",
                "address_line_2": "Building 17",
                "admin_area_2": "San Jose",
                "admin_area_1": "CA",
                "postal_code": "95131",
                "country_code": "US"
              }
            }
          },
          "application_context": {
            "brand_name": "ARTI",
            "locale": "en-US",
            "shipping_preference": "SET_PROVIDED_ADDRESS",
            "user_action": "SUBSCRIBE_NOW",
            "payment_method": {
              "payer_selected": "PAYPAL",
              "payee_preferred": "IMMEDIATE_PAYMENT_REQUIRED"
            },
            // "return_url": "https://darkmountain.blahworks.tech/success",
            // "cancel_url": "https://darkmountain.blahworks.tech/failure"
            "return_url": `${this.localHost}pricing/${this.userInfo.id}/success`,
            "cancel_url": `${this.localHost}pricing/${this.userInfo.id}/failure`
          }
        };
        this.userService.paypalPayment(data).subscribe((res: any) => {
          ($("#exampleModal") as any).modal("hide");
          // console.log(res)
          this.paypal_user_ID = res.id;
          let userPlanData = {
            sub_id: this.planDetail.subscription_details.subscription_id,
            type: this.planDetail.subscription_details.type,
            name: this.planDetail.subscription_details.name,
            price: this.planDetail.subscription_details.price,
            country: this.planDetail.subscription_details.country,
            paypal_ID: this.paypal_user_ID
          }
          localStorage.setItem('i', this.userInfo.id)
          localStorage.setItem('sub', JSON.stringify(userPlanData));
          this.filterLink = res.links.filter(elem => elem.rel == "approve")
          // console.log(this.filterLink[0].href);
          // console.log("RENEW")

          Swal.fire({
            title: 'Renew Subscription',
            text: "In case of upgrade, the new plan will be active only after the current plan expires.",
            //icon: 'warning',
            imageUrl: '../../../../assets/images/warning.png',
            showCancelButton: false,
            confirmButtonColor: '#00d957',
            cancelButtonColor: '#0f2f48',
            denyButtonColor: '#0f2f48',
            cancelButtonText: 'Cancel',
            denyButtonText: 'Upgrade To A New Plan',
            confirmButtonText: 'Renew Existing Plan <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 3c-4.625 0-8.442 3.507-8.941 8.001H10v-3l5 4-5 4v-3H3.06C3.56 17.494 7.376 21 12 21c4.963 0 9-4.037 9-9s-4.037-9-9-9z"></path></svg>',
            showCloseButton: true,
            showDenyButton: true,
          }).then((result) => {
            if (result.isConfirmed) {
              this.userService.cancelUserPlan(this.userInfo.id)
                .subscribe((res: any) => {
                  // console.log(res.userData, res.userData?.paypal_ID)
                  if (res.success) {
                    // let data = {
                    //   reason: "Not satisfied with the service"
                    // }
                    this.userService.usersubcancelstripe(this.stripesubID).subscribe((res: any) => {
                      console.log(res,'dev')
                    })
                    // this.userService.paypalSuspend(data, res.userData?.paypal_ID).subscribe((res: any) => {
                    //   // console.log(res)
                    // })
                  }
                  else {
                    Swal.fire({
                      text: res.message,
                      icon: 'error',
                    });
                  }
                });
              // this.router.navigateByUrl(`/renew-sub/${this.dentistId}`);
              setTimeout(()=>{
                window.location.href = this.filterLink[0].href;
              }, 1000)
              // console.log(result);
            } else if (result.isDenied) {
              // console.log(result)
              this.router.navigateByUrl(`/renew-sub/${this.dentistId}`);
            } else if (result.isDismissed) {
              ($("#exampleModal") as any).modal("show");
              // console.log(result)
            }
          });
        });
      }
      // return
    })
  }

  handleCancel() {
    ($("#exampleModal") as any).modal("hide");
    // console.log("CANCEL")
    Swal.fire({
      title: 'Cancel Subscription',
      text: "Current plan will be cancelled.",
      //icon: 'warning',
      imageUrl: '../../../../assets/images/warning.png',
      showCancelButton: true,
      confirmButtonColor: '#00d957',
      cancelButtonColor: '#0f2f48',
      cancelButtonText: 'Cancel',
      confirmButtonText: 'Confirm <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 3c-4.625 0-8.442 3.507-8.941 8.001H10v-3l5 4-5 4v-3H3.06C3.56 17.494 7.376 21 12 21c4.963 0 9-4.037 9-9s-4.037-9-9-9z"></path></svg>',
    }).then((result) => {
      if (result.isConfirmed) {
        // this.router.navigateByUrl(`/renew-sub/${this.dentistId}`);
        console.log('fff',this.userInfo.id)
        //return
        this.userService.cancelUserPlan(this.userInfo.id)
          .subscribe((res: any) => {
            // console.log(res.userData, res.userData?.paypal_ID)
            if (res.success==true) {
              console.log('kkkkkkk')
              //return
              this.userService.usersubcancelstripe(this.stripesubID).subscribe((res: any) => {
                console.log(res,'dev')
              })
              // let data = {
              //   reason: "Not satisfied with the service"
              // }
              console.log('lll')
              //return
             
              Swal.fire({
                // toast: true,
                // position: 'top-end',
                showConfirmButton: true,
                timer: 3000,
                title: 'Success!',
                text: "Your subscription is cancelled successfully.",
                //icon: 'success',
                imageUrl: '../../../../assets/images/success.png',
              });
              ($("#exampleModal") as any).modal("hide");
            }
            else {
              Swal.fire({
                text: res.message,
                icon: 'error',
              });
              //this.toastr.error(res.message);
            }

          });
      }
      else {
        // this.router.navigateByUrl(`/renew-sub/${this.dentistId}`);
        ($("#exampleModal") as any).modal("show");
      }
    });
  }

  // handleCancel() {
  //   ($("#exampleModal") as any).modal("hide");
  //   // console.log("CANCEL")
  //   Swal.fire({
  //     title: 'Cancel Subscription',
  //     text: "Current plan will be cancelled.",
  //     //icon: 'warning',
  //     imageUrl: '../../../../assets/images/warning.png',
  //     showCancelButton: true,
  //     confirmButtonColor: '#00d957',
  //     cancelButtonColor: '#0f2f48',
  //     cancelButtonText: 'Cancel',
  //     confirmButtonText: 'Confirm <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 3c-4.625 0-8.442 3.507-8.941 8.001H10v-3l5 4-5 4v-3H3.06C3.56 17.494 7.376 21 12 21c4.963 0 9-4.037 9-9s-4.037-9-9-9z"></path></svg>',
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       // this.router.navigateByUrl(`/renew-sub/${this.dentistId}`);
  //       this.userService.cancelUserPlan(this.userInfo.id)
  //         .subscribe((res: any) => {
  //           // console.log(res.userData, res.userData?.paypal_ID)
  //           if (res.success) {
  //             let data = {
  //               reason: "Not satisfied with the service"
  //             }
  //             this.userService.paypalSuspend(data, res.userData?.paypal_ID).subscribe((res: any) => {
  //               // console.log(res)
  //             })
  //             Swal.fire({
  //               // toast: true,
  //               // position: 'top-end',
  //               showConfirmButton: true,
  //               timer: 3000,
  //               title: 'Success!',
  //               text: "Your subscription is cancelled successfully.",
  //               //icon: 'success',
  //               imageUrl: '../../../../assets/images/success.png',
  //             });
  //             ($("#exampleModal") as any).modal("hide");
  //           }
  //           else {
  //             Swal.fire({
  //               text: res.message,
  //               icon: 'error',
  //             });
  //             //this.toastr.error(res.message);
  //           }

  //         });
  //     }
  //     else {
  //       // this.router.navigateByUrl(`/renew-sub/${this.dentistId}`);
  //       ($("#exampleModal") as any).modal("show");
  //     }
  //   });
  // }
  setNew() {
    const data = {
      id: this.userInfo.id,
      password: this.curPass,
      newPassword: this.newPass,
      cnfPassword: this.cnfPass


    }
    // console.log(this.curPass, this.newPass, this.cnfPass)
    if (this.curPass !== undefined && this.newPass !== undefined && this.cnfPass !== undefined) {
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
      else {
        this.userService.resetPassword(data).subscribe((res: any) => {
          // console.log("Password changes", res);
          if (res.success) {
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
    else {
      Swal.fire({
        text: 'Please enter the password',
        icon: 'error'
      });
      return false;

    }
  }
  dashboardFn(e: any) {
    // this.router.navigateByUrl("/dashboard")
    // console.log(this.router.url, this.changeUrl)
    if (this.changeUrl) {
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
            //icon: 'success',
            imageUrl: '../../../../assets/images/success.png',
          });
          if (e == 'dashboard') {
            this.appService.updateGetUrl(false)
            this.router.navigateByUrl('/dashboard');
          } else if (e == 'upload-xray/0') {
            this.appService.updateGetUrl(false)
            this.router.navigateByUrl('/upload-xray/0');
          } else if (e == 'logout') {
            this.appService.updateGetUrl(false)
            this.appService.logout()
          }

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
  logout() {
    Swal.fire({
      title: 'Are you sure?',
      // text: "You won't be Logout!",
      //icon: 'warning',
      imageUrl: '/../../assets/images/warning.png',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Logout! <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 3c-4.625 0-8.442 3.507-8.941 8.001H10v-3l5 4-5 4v-3H3.06C3.56 17.494 7.376 21 12 21c4.963 0 9-4.037 9-9s-4.037-9-9-9z"></path></svg>',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          title: 'Success!',
          text: 'You Have Been Successfully Logged-out',
          //icon: 'success',
          imageUrl: '../../assets/images/success.png',
        });
        this.appService.logout();
      }
    });
  }
}
