import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import {
  IPayPalConfig,

  ICreateOrderRequest,
  IPayPalButtonStyle
} from 'ngx-paypal';
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-renew-sub',
  templateUrl: './renew-sub.component.html',
  styleUrls: ['./renew-sub.component.scss']
})
export class RenewSubComponent implements OnInit {
  title = 'ARTI - Renew Subscription';
  public monthlyAllData: any = [];
  public yearlyAllData: any = [];
  public monthlyPlan: any = false;
  public yearlyPlan: any = false;
  public planStartDate: any;
  allData = []
  subsId: any = 0;
  subsType: any = "";
  subsTitle: any = "";
  subsPrice: any = "";
  subsName: any;
  subsCurrency: any;
  subsCountry: any;
  ipAddress: any;
  country: any;
  IsmodelShow: boolean = false;
  public payPalConfig?: IPayPalConfig;
  userId: string;
  userData: any;
  curPlanDetail: any;
  preEnd_date: any;
  preStart_date: any;
  showSuccess: any;
  showCancel: any;
  showError: any;
  selected: boolean = false;
  public filterLink: Array<any> = [];
  public countriesInHere: Array<any> = ['India', 'United States', 'Pakistan',  'Austria', 'Belgium', 'Croatia', 'Cyprus', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 'Portugal', 'Slovakia', 'Slovenia', 'Spain', 'United Kingdom', 'Kenya', 'Saudi Arabia', 'Kuwait','China', 'Netherland']
  subsPaypalID: any;
  paypal_ID: any;
  userPlanData: { sub_id: string; type: string; name: string; price: string; country: string; paypal_ID: any; currency:string; };
  readOnly: boolean;
  paypalBtn: boolean;
  userInfo: any;
  localHost: string;
  public StripePriceID: any

  constructor(private router: Router,
    private userService: UserService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private titleService: Title,) {
      titleService.setTitle(this.title);
      this.localHost = environment.LOCAL_HOST
    }

  ngOnInit(): void {
    this.getIPAddress();

    this.monthlyPlan = true;

    this.userId = this.route.snapshot.paramMap.get('dentist_id');

    this.myPlanDetail();
    setTimeout(() => {
      this.planList();
    }, 1000)


    //this.initConfig();
  }
  planList() {

    this.userService.getSubscriptionList().subscribe((res: any) => {
      // console.log(res, "response")
      if (res.success) {
        // console.log("plan fetched successfully")
        this.allData = res.getData
        this.monthly();
      }
      else {
        // console.log("plan not fetched successfully")

      }
    })

  }
  myPlanDetail() {
    this.userService.getUserPlanById(this.userId).subscribe((res: any) => {
      // console.log("myPlan", res)
      if (res.success) {
        // console.log("myPlan1", res.getData)
        this.curPlanDetail = res.getData;
        this.subsType= this.curPlanDetail?.subscription_details?.subscription_id?.type;
        this.subsPrice = this.curPlanDetail?.subscription_details?.subscription_id?.amount;
        this.subsCountry = this.curPlanDetail?.subscription_details?.subscription_id?.country;
        this.subsName = this.curPlanDetail?.subscription_details?.subscription_id?.name;
        this.subsCurrency = this.curPlanDetail?.subscription_details?.subscription_id?.currency;
        // this.subsId= this.curPlanDetail?.subscription_details.subscription_id._id;
        this.preStart_date = this.curPlanDetail?.subscription_details.start_date;
        this.preEnd_date = this.curPlanDetail?.subscription_details.end_date;
        if(new Date(this.preEnd_date).getTime() > new Date().getTime()){
          this.planStartDate = this.preEnd_date;
        } else {
          this.planStartDate = new Date().toISOString()
        }

        // console.log("***", this.preEnd_date, new Date(this.preEnd_date).getTime(), Date.now(), new Date().getTime(), new Date().toISOString(), new Date().toLocaleString())
        // console.log("planDetail", res)
      }
      else {
        // console.log(res, "error")
      }
    })
  }
  // handleClick() {
  //   // if(!this.checked){
  //   //   this.displayStyle = "none"
  //   //   return Swal.fire({
  //   //     text: "Please accept the terms and conditions.",
  //   //     icon: 'warning',
  //   //   });
  //   // }
  //   // else if(!this.subsId || this.subsId == 0){
  //   //   this.displayStyle = "none"
  //   //   return Swal.fire({
  //   //     text: "Please choose a plan.",
  //   //     icon: 'warning',
  //   //   });
  //   // }
  //   // // console.log(this.registerForm.value);
  //   if (this.userId != "" && this.userId != undefined && this.userId != null) {
  //     // this.userService.updateUser(this.curPlanDetail, this.userId)
  //     //   .subscribe((res: any) => {
  //     //     if (res.success) {
  //           //this.toastr.success(res.message);
  //           // Swal.fire({
  //           //   text: res.message,
  //           //   icon: 'success',
  //           // });
  //           // this.userInfo.subscribed = true;
  //           // localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
  //           // // console.log("DO HERE!!!!!!")
  //           // this.paypalBtn = true;
  //           // this.readOnly = true;
  //           // document.getElementById("country").style.pointerEvents = 'none';

  //           //  this.router.navigateByUrl('/registered-dentists');

  //           // this.userPlanData = {
  //           //   sub_id: this.subsId,
  //           //   type: this.subsType,
  //           //   name: this.subsTitle,
  //           //   price: this.subsPrice,
  //           //   country: this.subsCountry,
  //           //   paypal_ID: this.paypal_ID
  //           // }
  //           const userPlanData = {
  //             sub_id: this.subsId,
  //             type: this.subsType,
  //             pre_start_date: this.preStart_date,
  //             pre_end_date: this.preEnd_date,
  //             pre_plan_name: this.subsName,
  //             pre_plan_country: this.subsCountry,
  //             pre_plan_price: this.subsPrice,
  //             //paypal_ID: this.paypal_ID
  //           }
  //           localStorage.setItem('renew_sub', JSON.stringify(userPlanData))
  //           // console.log(this.filterLink[0].href, this.userId, this.userPlanData)
  //           // return;
  //           // this.userService.getSubscriptionRenew(userPlanData, this.userId).subscribe((res: any) => {
  //           //   // console.log(res)

  //           //   if (res.success) {
  //               // this.userInfo.subscribed = true;
  //               // localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
  //               //this.toastr.success(res.message);
  //               // this.IsmodelShow = false
  //               // // console.log(this.IsmodelShow);
  //               // ($("#myModal") as any).modal("hide");
  //               //  this.handleClick();
  //               // <HTMLElement>document.getElementById('myModal').modal("hide")

  //               // Swal.fire({
  //               //   text: "You have successfully subscribed",
  //               //   icon: 'success',
  //               // });
  //               /*var modal= document.getElementById("launch_ad");
  //                 modal.style.display = "none";*/
  //               // if (this.userInfo.token != null && this.userInfo.token != undefined && this.userInfo.token != '') {
  //                 // // console.log("iff")

  //                 // this.router.navigateByUrl("/dashboard")
  //               // }
  //               // else {
  //                 // // console.log("elseee")
  //                 // this.router.navigateByUrl("/login")
  //               // }
  //           //   }
  //           // })

  //       //   } else {
  //       //     Swal.fire({
  //       //       text: res.message,
  //       //       icon: 'error',
  //       //     });

  //       //     //this.toastr.error(res.message);
  //       //   }
  //       // });
  //   }
  // }


  handleClick() {
    if (this.userId != "" && this.userId != undefined && this.userId != null) {
      
            const userPlanData = {
              sub_id: this.subsId,
              type: this.subsType,
              pre_start_date: this.preStart_date,
              pre_end_date: this.preEnd_date,
              pre_plan_name: this.subsName,
              pre_plan_country: this.subsCountry,
              pre_plan_currency: this.subsCurrency,
              pre_plan_price: this.subsPrice,
              stripePriceID: this.StripePriceID
              //paypal_ID: this.paypal_ID
            }
            localStorage.setItem('renew_sub', JSON.stringify(userPlanData))
            this.userService.getUserRecordById(this.userId).subscribe((res: any) => {
              console.log(res, "resssssssssssssssssssssssssssssssssssssss")
              //this.userData = res.getData;
                console.log('dev')
                //return
              let data = {price: this.StripePriceID }
              this.userService.createPrice(data)
                .subscribe((res: any) => { 
                  console.log(res.session.url)
                  localStorage.setItem('stripedata', JSON.stringify(res.session));
                  //console.log()
                  //return;
                  window.open(res.session.url, "_self");
                  if (res) {
                      
                   }else{
    
                   }  
              });

            })
           
    }
  }
  getIPAddress() {
    this.http.get(environment.GEO_LOCATION).subscribe((res: any) => {
      const data = res;
      this.ipAddress = data.IPv4
      this.country = data.country;
      // console.log(this.country, "ipAddress", data)
    });
  }
  monthly() {
    // this.monthlyAllData = this.allData.filter(elem => elem.type === "Monthly")
    // console.log(this.countriesInHere.includes(this.country))
    if (this.countriesInHere.includes(this.country)) {
      this.monthlyAllData = this.allData.filter(elem => elem.type === "Monthly" && elem.country.includes(this.country))
    } else {
      this.monthlyAllData = this.allData.filter(elem => elem.type === "Monthly" && elem.country.includes("Others"))
    }
    this.yearlyAllData = []
    this.monthlyPlan = true;
    this.yearlyPlan = false;
    // console.log(this.allData, this.yearlyAllData, this.monthlyAllData, this.subsId);
  }

  yearly() {
    // this.yearlyAllData = this.allData.filter(elem => elem.type === "Yearly")
    // console.log(this.countriesInHere.includes(this.country))
    if (this.countriesInHere.includes(this.country)) {
      this.yearlyAllData = this.allData.filter(elem => elem.type === "Yearly" && elem.country.includes(this.country))
    } else {
      this.yearlyAllData = this.allData.filter(elem => elem.type === "Yearly" && elem.country.includes("Others"))
    }
    this.monthlyAllData = [];
    this.monthlyPlan = false;
    this.yearlyPlan = true;
    // console.log(this.allData, this.yearlyAllData, this.monthlyAllData, this.monthlyPlan, this.subsId);
  }
  // getSubscription(id, type, pricing_amount, title, country, stripeProductID, stripePriceID) {
  //   localStorage.setItem('i', this.userId)
  //   // console.log(id, type, pricing_amount, title, country);
  //   if(id != 0){
  //     this.selected = true;
  //   } else {
  //     this.selected = false;
  //   }
  //   this.subsId = id;
  //   this.subsType = type;
  //   this.subsPrice = pricing_amount;
  //   this.subsTitle = title;
  //   this.subsName = title;
  //   this.subsCountry = country;
  //   this.StripePriceID = stripePriceID
  //   //this.subsPaypalID = paypalID

  //   // // console.log(this.subsPaypalID)
  //   // let token = JSON.parse(localStorage.getItem('p-data')).token;
  //   // console.log(this.subsPaypalID, this.planStartDate, this.curPlanDetail?.paypal_ID)
  //   // console.log(`${this.localHost}pricing/${this.userId}/success`)
  //   let data = {
  //     "plan_id": `${this.subsPaypalID}`,
  //     // "start_time": `${this.planStartDate}`,
  //     // "quantity": "20",
  //     "auto_renewal": true,
  //     "shipping_amount": {
  //         "currency_code": "USD",
  //         "value": "0"
  //     },
  //     "subscriber": {
  //         "name": {
  //             "given_name": "John",
  //             "surname": "Doe"
  //         },
  //         "email_address": "sb-zhqmo25396320@personal.example.com",
  //         "shipping_address": {
  //             "name": {
  //                 "full_name": "John Doe"
  //             },
  //             "address": {
  //                 "address_line_1": "2211 N First Street",
  //                 "address_line_2": "Building 17",
  //                 "admin_area_2": "San Jose",
  //                 "admin_area_1": "CA",
  //                 "postal_code": "95131",
  //                 "country_code": "US"
  //             }
  //         }
  //     },
  //     "application_context": {
  //         "brand_name": "ARTI",
  //         "locale": "en-US",
  //         "shipping_preference": "SET_PROVIDED_ADDRESS",
  //         "user_action": "SUBSCRIBE_NOW",
  //         "payment_method": {
  //             "payer_selected": "PAYPAL",
  //             "payee_preferred": "IMMEDIATE_PAYMENT_REQUIRED"
  //         },
  //         "return_url": `${this.localHost}pricing/${this.userId}/success`,
  //         "cancel_url": `${this.localHost}pricing/${this.userId}/failure`
  //         // "return_url": "https://darkmountain.blahworks.tech/success",
  //         // "cancel_url": "https://darkmountain.blahworks.tech/failure"
  //     }
  //   }
  //   // let dataToSend = {
  //   //   reason: "Subscription renewed."
  //   // }
  //   // this.userService.paypalActivate(dataToSend, this.curPlanDetail?.paypal_ID).subscribe((resp: any) => {
  //   //   // console.log(resp, "Activate")
  //   // })
  //   this.userService.paypalPayment(data).subscribe((res: any) => {
  //     // console.log(res)
  //     this.paypal_ID = res.id;
  //     // this.selected = true;
  //     this.filterLink = res.links.filter(elem => elem.rel == "approve")
  //     // this.router.navigateByUrl(this.filterLink[0].href)
  //     this.userPlanData = {
  //       sub_id: '',
  //       type: '',
  //       name: '',
  //       price: '',
  //       country: '',
  //       paypal_ID: res.id
  //     }
  //     // console.log(this.filterLink[0].href, this.userId, this.userPlanData)
  //     // return;
  //     // this.userService.getSubscription(this.userPlanData, this.userId).subscribe((res: any) => {
  //     //   // console.log(res)

  //     //   if (res.success) {
  //     //     // this.userInfo.subscribed = true;
  //     //     localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
  //     //     //this.toastr.success(res.message);
  //     //     // this.IsmodelShow = false
  //     //     // // console.log(this.IsmodelShow);
  //     //     // ($("#myModal") as any).modal("hide");
  //     //     //  this.handleClick();
  //     //     // <HTMLElement>document.getElementById('myModal').modal("hide")

  //     //     // Swal.fire({
  //     //     //   text: "You have successfully subscribed",
  //     //     //   icon: 'success',
  //     //     // });
  //     //     /*var modal= document.getElementById("launch_ad");
  //     //       modal.style.display = "none";*/
  //     //     if (this.userInfo.token != null && this.userInfo.token != undefined && this.userInfo.token != '') {
  //     //       // console.log("iff")

  //     //       // this.router.navigateByUrl("/dashboard")
  //     //     }
  //     //     else {
  //     //       // console.log("elseee")
  //     //       // this.router.navigateByUrl("/login")
  //     //     }
  //     //   }
  //     // })
  //   })



  //   // if(!this.checked){
  //   //   return Swal.fire({
  //   //     text: "Please accept the terms and conditions.",
  //   //     icon: 'error',
  //   //   });
  //   // }
  //   // this.userService.getUserRecordById(this.userId).subscribe((res: any) => {
  //   //   //// console.log(res, "resssssssssssssssssssssssssssssssssssssss")
  //   //   this.userData = res.getData;
  //   //   // console.log(this.userData, this.userInfo,this.userInfo.token)

  //   //   if (res.success) {
  //   //     if (this.userData[0].subscription_details.status == true) {
  //   //       Swal.fire({
  //   //         text: "You have already subscribed",
  //   //         icon: 'error',
  //   //       });
  //   //       return false;
  //   //     }

  //   //     else {

  //   //       var end_date;
  //   //       var now = new Date();
  //   //       // console.log(id, type)
  //   //       if (type == "Monthly") {


  //   //         end_date = new Date(now.setMonth(now.getMonth() + 1));
  //   //         //end_date = new Date(now.setMinutes(now.getMinutes() + 5));
  //   //         // console.log(end_date, "Date", new Date());

  //   //       }
  //   //       else if (type === "Yearly") {


  //   //         end_date = new Date(now.setMonth(now.getMonth() + 12));

  //   //         // console.log(end_date, "Date", new Date());

  //   //       }

  //   //      //razorpay code

  //   //      const subscriptiondetails = {
  //   //       amount: pricing_amount * 100,
  //   //       user_id: this.userId,
  //   //       receipt: 'Receipt #' + (Math.floor(Math.random() * 10000000) + 1),
  //   //     };
  //   //     // console.log(subscriptiondetails);
  //   //     this.spinner.show();
  //   //     this.userService.order(subscriptiondetails).subscribe(
  //   //       (response: any) => {
  //   //         this.spinner.hide();
  //   //         if(response.success){

  //   //         }else{
  //   //           Swal.fire({
  //   //             title: 'Error!',
  //   //             width: 400,
  //   //             text: response.message,
  //   //             icon: 'error',
  //   //             confirmButtonText: 'Ok',
  //   //           });
  //   //           return false;
  //   //         }
  //   //         //// console.log(response, 'iiiiiiii');
  //   //         console.error('response for purchase ', response);
  //   //         let order = response?.order;
  //   //         this.razorPayOptions.order_id = order?.id;
  //   //         this.razorPayOptions.amount = order?.amount_due;
  //   //         const that = this;
  //   //         this.razorPayOptions.handler = (response: any, error: any) => {
  //   //           console.error(response);
  //   //           // console.error(error);
  //   //           if (!error) {
  //   //             const allVarificationData = {
  //   //               sub_id: id,
  //   //               end_date: end_date,
  //   //               start_date: Date.now(),
  //   //               user_id: this.userId,
  //   //               pricing_plan_id:id,
  //   //               razorpay_order_id: response.razorpay_order_id,
  //   //               razorpay_payment_id: response.razorpay_payment_id,
  //   //               razorpay_signature: response.razorpay_signature,
  //   //             };
  //   //             // console.log(allVarificationData, 'hiiiiiii');
  //   //             //return;
  //   //             let startDate= new DatePipe('en-US').transform(Date.now(), 'dd-MM-yyyy hh:mm a');
  //   //             let endDate = new DatePipe('en-US').transform(end_date, 'dd-MM-yyyy hh:mm a')
  //   //             this.spinner.show();
  //   //             that.userService
  //   //               .ordercomplete(allVarificationData)
  //   //               .subscribe((res: any) => {
  //   //                 if (res.success) {
  //   //                   this.spinner.hide();
  //   //                   Swal.fire({
  //   //                     title: 'Thank You for subscribe',
  //   //                     width: 400,
  //   //                     text: 'Thank You for subscription',
  //   //                     html:'<strong>Your subscription details are :</strong><br><br>'
  //   //                     +"<strong>Start Date : </strong>"+startDate+ '<br>'
  //   //                     +'<strong>End Date : </strong>'+endDate+'<br>'
  //   //                     +'<strong>Order Id : </strong>'+response.razorpay_order_id+'<br>'
  //   //                     +'<strong>Transaction Id : </strong>'+response.razorpay_payment_id+'<br>',
  //   //                     icon: 'success',
  //   //                     confirmButtonText: 'Ok',
  //   //                   });
  //   //                   if(this.userInfo.token!=null&& this.userInfo.token!=undefined&& this.userInfo.token!='' )
  //   //                   {// console.log("iff")
  //   //                     this.router.navigateByUrl("/dashboard")
  //   //                 }
  //   //                 else{
  //   //                   // console.log("elseee")
  //   //                   this.router.navigateByUrl("/login")
  //   //                 }
  //   //              }
  //   //              else
  //   //               {
  //   //                   this.spinner.hide();
  //   //                   Swal.fire({
  //   //                     title: 'Error!',
  //   //                     width: 400,
  //   //                     text: 'Payment unsuccessful, please try again',
  //   //                     icon: 'error',
  //   //                     confirmButtonText: 'Ok',
  //   //                   });
  //   //                   console.error(res.message);
  //   //                   // this.router.navigate(['/profile']);
  //   //                 }
  //   //               });
  //   //           }
  //   //         };
  //   //         console.error('op', this.razorPayOptions);

  //   //         let rzp1 = new Razorpay(this.razorPayOptions);
  //   //         rzp1.open();
  //   //         console.error('opened');
  //   //       },
  //   //       (error) => {
  //   //         console.error('error', error);
  //   //       }
  //   //     );
  //   //       //razorpay code ends

  //   //   /*  this.userPlanData = {
  //   //         sub_id: id,
  //   //         end_date: end_date,
  //   //         start_date: Date.now(),
  //   //       }
  //   //       this.userService.getSubscription(this.userPlanData, this.userId).subscribe((res: any) => {
  //   //         // console.log(res)
  //   //         if (res.success) {
  //   //           //this.toastr.success(res.message);
  //   //           Swal.fire({
  //   //             text: "You have successfully subscribed",
  //   //             icon: 'success',
  //   //           });
  //   //           //! changed here
  //   //          /* this.userService.onLogin(this.appService.currentApprovalStageMessage.source['_value']).subscribe((result: any) => {
  //   //             // console.log(result.userInfo.id);
  //   //             let id= result.userInfo.id;
  //   //             if (result.success) {
  //   //               this.userService.getUserRecordById(id).subscribe((res: any) => {
  //   //                 // console.log(res,"*****");
  //   //                  if(res.getData[0]?.role=='dentist'){
  //   //                 let status = res.getData[0]?.subscription_details.status;
  //   //                  // console.log(status)
  //   //                    if(status==true){
  //   //                     this.appService.login(result);
  //   //                    }
  //   //                    else
  //   //                    {
  //   //                     this.router.navigateByUrl("/pricing/"+result.userInfo.id);
  //   //                    // [routerLink]="'/dentist-profile/'+user._id"
  //   //                    }

  //   //               }
  //   //               else{
  //   //                 this.appService.login(result);
  //   //               }

  //   //               })

  //   //               //this.toastr.success(result.message);
  //   //             //
  //   //             }

  //   //             else {
  //   //               this.isAuthLoading = false;
  //   //               //this.toastr.error(result.message);
  //   //               Swal.fire({
  //   //                 text: result.message,
  //   //                 icon: 'error',
  //   //               });
  //   //             }
  //   //           });*/
  //   //        /* if(this.userInfo.token!=null&& this.userInfo.token!=undefined&& this.userInfo.token!='' )
  //   //           {this.router.navigateByUrl("/dashboard")
  //   //         }
  //   //         else{
  //   //           this.router.navigateByUrl("/login")
  //   //         }
  //   //       }
  //   //         else {
  //   //           Swal.fire({
  //   //             text: res.message,
  //   //             icon: 'error',
  //   //           });
  //   //           //this.toastr.error(res.message);
  //   //         }
  //   //       });*/

  //   //     }
  //   //   }
  //   // })

  // }

  getSubscription(id, type, pricing_amount, title, country, stripeProductID, stripePriceID, currency) {
    localStorage.setItem('i', this.userId)
    console.log(id, type, pricing_amount, title, country,currency);
    //return
    if(id != 0){
      this.selected = true;
    } else {
      this.selected = false;
    }
    this.subsId = id;
    this.subsType = type;
    this.subsPrice = pricing_amount;
    this.subsTitle = title;
    this.subsName = title;
    this.subsCountry = country;
    this.StripePriceID = stripePriceID
    this.subsCurrency = currency
    

  }
  
  // private initConfig(): void {
  //   //(<HTMLImageElement>document.querySelector(".paypal-logo")).src="";
  //   // var modal= document.getElementById("launch_ad");
  //   // modal.style.display = "none";

  //   this.payPalConfig = {
  //     currency: 'USD',
  //     clientId: 'sb',
  //     // ! for orders on client side

  //     createOrderOnClient: (data) => <ICreateOrderRequest>{

  //       intent: 'CAPTURE',
  //       purchase_units: [{
  //         amount: {
  //           currency_code: 'USD',
  //           value: `${this.subsPrice}`,
  //           breakdown: {
  //             item_total: {
  //               currency_code: 'USD',
  //               value: `${this.subsPrice}`
  //             }
  //           }
  //         },
  //         items: [{
  //           name: 'ARTI',
  //           quantity: '1',
  //           category: 'DIGITAL_GOODS',
  //           unit_amount: {
  //             currency_code: 'USD',
  //             value: `${this.subsPrice}`,
  //           },
  //         }]
  //       }]
  //     },
  //     advanced: {
  //       commit: 'true',
  //     },
  //     style: {
  //       layout: 'horizontal',
  //       tagline: false,
  //       shape: 'rect',
  //       color: 'gold',
  //     },
  //     onApprove: (data, actions) => {
  //       // console.log('onApprove - transaction was approved, but not authorized', data, actions);
  //       actions.order.get().then(details => {
  //         // console.log('onApprove - you can get full order details inside onApprove: ', details),
  //           //my code
  //           this.userService.getUserRecordById(this.userId).subscribe((res: any) => {
  //             console.log(res, "resssssssssssssssssssssssssssssssssssssss")
  //             this.userData = res.getData;
  //             // console.log(this.userData)

  //             if (res.success) {
  //               var end_date;
  //               var now = new Date();
  //               // console.log(this.subsType)
  //               if (this.subsType == "Monthly") {
  //                 end_date = new Date(now.setMonth(now.getMonth() + 1));
  //                 end_date = new Date(now.setMinutes(now.getMinutes() + 5));
  //                 // console.log(end_date, "Date", new Date());
  //               }
  //               else if (this.subsType === "Yearly") {
  //                 end_date = new Date(now.setMonth(now.getMonth() + 12));

  //                 // console.log(end_date, "Date", new Date());
  //               }
  //             }
  //             const userPlanData = {
  //               sub_id: this.subsId,
  //               type: this.subsType,
  //               pre_start_date: this.preStart_date,
  //               pre_end_date: this.preEnd_date,
  //               pre_plan_name: this.subsTitle,
  //               pre_plan_country: this.subsCountry,
  //               pre_plan_price: this.subsPrice,
  //             }
  //             this.userService.getSubscriptionRenew(userPlanData, this.userId).subscribe((res: any) => {
  //               // console.log(res)
  //               if (res.success) {
  //                 //this.toastr.success(res.message);
  //                 this.IsmodelShow = false;
  //                 // console.log(this.IsmodelShow);
  //                 ($("#myModal") as any).modal("hide");
  //                 //  this.handleClick();
  //                 // <HTMLElement>document.getElementById('myModal').modal("hide")

  //                 Swal.fire({
  //                   text: "You subscription has renewed",
  //                   icon: 'success',
  //                 });
  //                 /*var modal= document.getElementById("launch_ad");
  //                  modal.style.display = "none";*/
  //               }
  //             })

  //           })
  //       });
  //     },
  //     // ! for orders on server side
  //     // createOrderOnServer: (data) => fetch('/my-server/create-paypal-transaction')
  //     //         .then((res) => res.json())
  //     //         .then((order) => order.orderID),
  //     //     onApprove: (data, actions) => {
  //     //         // console.log('onApprove - transaction was approved, but not authorized', data, actions);
  //     //         actions.order.get().then(details => {
  //     //             // console.log('onApprove - you can get full order details inside onApprove: ', details);
  //     //         });

  //     // },
  //     onClientAuthorization: (data) => {
  //       // console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
  //       this.showSuccess = true;
  //     },
  //     onCancel: (data, actions) => {
  //       // console.log('OnCancel', data, actions);
  //       // this.checked = false;
  //       this.showCancel = true;
  //     },
  //     onError: err => {
  //       // console.log('OnError', err);
  //       this.showError = true;
  //     },
  //     onClick: (data, actions) => {
  //       // console.log('onClick', data, actions);
  //       this.resetStatus();
  //     }

  //   };
  // }
  resetStatus() {
    document.getElementById("launch_ad")?.click();
    // console.log("THIS IS RESET FOR PAYPAL");
    // console.log(this.subsPrice.toString(), this.subsType);
  }


  logout() {

  }
  checkoutBtn() {
    this.IsmodelShow = true;
  }
  errmsg() {
    Swal.fire({
      text: "Please select a plan",
      icon: 'warning',
    });
  }
}
