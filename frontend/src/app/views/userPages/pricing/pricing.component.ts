import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, Directive, Input, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, NgForm, ValidationErrors, Validators, FormBuilder } from '@angular/forms';
import Swal from 'sweetalert2';
// import { OwlOptions } from 'ngx-owl-carousel-o';
import { UserService } from 'src/app/services/user.service';
import { AppService } from 'src/app/services/app.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpClient } from '@angular/common/http';
import { DatePipe, Location, DOCUMENT } from '@angular/common';
import {
  IPayPalConfig,

  ICreateOrderRequest,
  IPayPalButtonStyle,
  ICreateSubscriptionRequest
} from 'ngx-paypal';
import { environment } from 'src/environments/environment';
import { Title } from '@angular/platform-browser';
import * as bootstrap from "bootstrap";
import * as $AB from "jquery";
declare var Razorpay: any;
// declare var Paypal: any;
// declare global {
//   interface Window {
//     paypal:any;
//   }
// }

const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');



@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.component.html',
  styleUrls: ['./pricing.component.scss']
})


export class PricingComponent implements OnInit, AfterViewInit {
  // @ViewChild("myinput") myInputField: ElementRef;
  // userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  @Directive({
    selector: "[autofocus]"
  })
  public registerForm: FormGroup;
  public isAuthLoading = false;
  public allData: any = [];
  title = 'ARTI - Pricing';
  userData: any;
  userPlanData: any;
  userInfo: any;
  userId: any;
  fname: any;
  lname: any;
  mail: any;
  checked: boolean = false;
  localHost: string;
  public paypal_ID: any;
  public monthlyAllData: any = [];
  public yearlyAllData: any = [];
  public monthlyPlan: any = false;
  public yearlyPlan: any = false;
  public noPlans: boolean = false;
  showSuccess: any;
  showCancel: any;
  showError: any;
  public payPalConfig?: IPayPalConfig;
  public subsId: any = 0;
  public subsType: any;
  public subsPrice: any;
  public subscurrency: any;
  public subsTitle: any;
  public subsCountry: any;
  public subsPaypalID: any;
  public filterLink: any;
  public paypalView: any = false;
  public payData: any;
  public countryList: any = "-Select Country-";
  public stateList = "-Select State-";
  public IsmodelShow: any = false;
  public paypalBtn: any = false;
  public allcountries: Array<any>;
  public allstates: Array<any>;
  ipAddress = '';
  public payDisabled: boolean = false;
  public payDisabledMsg: any;
  public countriesInHere: Array<any> = ['India', 'United States', 'Pakistan',  'Austria', 'Belgium', 'Croatia', 'Cyprus', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 'Portugal', 'Slovakia', 'Slovenia', 'Spain', 'United Kingdom', 'Kenya', 'Saudi Arabia', 'Kuwait','China', 'Netherland']
  focus: any;
  public dots: boolean = false;
  //route: any;
  public paypalCountry: any = "US";
  public StripePriceID: any = '';
  // private razorPayOptions: any = {
  //   key: 'rzp_test_llXrMfq95r3LMF', // Enter the test Key ID generated from the Dashboard
  //   //key: 'rzp_live_bGBd6XL9krEnCa', // Enter the Key live ID generated from the Dashboard
  //   amount: '',
  //   currency: 'INR',
  //   name: 'ARTI',
  //   description: 'ARTI Subscription payment',
  //   order_id: 'ORDERID_FROM_BACKEND',
  //   // image: 'https://digitalpehchan.in/assets/images/DP%20LOGO%20BW.png',
  //   handler: function (response) {
  //     // console.log('this is the response ', response);
  //   },
  //   notes: {
  //     address: 'Thank you for saving people in need',
  //   },
  //   theme: {
  //     color: '#00d957',
  //   },
  //   // http_post: this.userService
  // };
  toastr: any;
  country: any = "";
  readOnly: boolean = false;
  userSubscription: any;
  buyNow: boolean = false;




  constructor(private router: Router,
    private userService: UserService,
    private appService: AppService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private el: ElementRef,
    private titleService: Title,
    private _location: Location,
    @Inject(DOCUMENT) private document: Document,
    ) {
      titleService.setTitle(this.title);
      this.registerForm = this.formBuilder.group({})
      this.userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      this.localHost = environment.LOCAL_HOST;
  }

  // private payPalButtonContainerElem?: ElementRef;
  // @ViewChild("payPalButtonContainer", { static: false })
  // set payPalButtonContainer(content: ElementRef) {
  //   this.payPalButtonContainerElem = content;
  // }
  // @ViewChild('paypalRef',{static: true}) public paypalRef: ElementRef;
  ngOnInit(): void {
    // console.log(this.checked, this.subsId, this.userInfo);
    // this.userInfo.subscribed = true;
    // console.log('window.paypal', this.userInfo);
    this.getIPAddress();
    // this.userService.getSubscriptionListPricing().subscribe((res: any) => {
    //   // console.log(res, "response")
    //   if (res.success) {
    //     // console.log("plan fetched successfully")
    //     this.allData = res.getData
    //   }
    //   else {
    //     // console.log("plan not fetched successfully")
    //   }
    // })
    // // console.log(this.appService.currentApprovalStageMessage.source['_value'], "------------");

    setTimeout(() => {
      // console.log(this.allData)
    }, 1000)
    this.userId = this.route.snapshot.paramMap.get('dentist_id');
    this.userService.getUserRecordById(this.userId).subscribe((res: any) => {
      // console.log(res.getData[0].first_name, res.getData[0].last_name, res.getData[0].email);
      this.fname = res.getData[0].first_name;
      this.lname = res.getData[0].last_name;
      this.mail = res.getData[0].email;
    })
    this.monthlyPlan = true;
    this.yearlyPlan = false;
    // if (this.monthlyPlan) {
    //   setTimeout(() => {
    //     if (this.countriesInHere.includes(this.country)) {
    //       this.monthlyAllData = this.allData.filter(elem => elem.type === "Monthly" && elem.country == this.country)
    //     } else {
    //       this.monthlyAllData = this.allData.filter(elem => elem.type === "Monthly" && elem.country == "Others")
    //     }
    //   }, 1000)
    // }
    this.initConfig();
    this.registerForm = new FormGroup({
      first_name: new FormControl(this.fname, Validators.required),
      last_name: new FormControl(this.lname, Validators.required),
      email: new FormControl(this.mail, [Validators.pattern('^([a-zA-Z0-9\.-]+)@([a-zA-Z0-9-]+).[a-zA-Z]{2,4}$')]),
      contact_number: new FormControl(null, Validators.required),
      address1: new FormControl(null, Validators.required),
      pincode: new FormControl(null, Validators.required),
      city: new FormControl(null, Validators.required),
      state: new FormControl('-Select State-', Validators.required),
      country: new FormControl('-Select Country-', Validators.required),
      // password: new FormControl(null, [Validators.required, Validators.minLength(7), Validators.maxLength(10), alphaNumericValidator]),
      // repassword: new FormControl(null, [Validators.required, Validators.minLength(7), Validators.maxLength(10), alphaNumericValidator]),
      age: new FormControl(null, Validators.required),
      license_no: new FormControl(null, Validators.required),
    });

    this.registerForm = this.formBuilder.group({
      first_name: [this.fname, [Validators.required]],
      last_name: ['', [Validators.required]],
      contact_number: ['', [Validators.pattern('[- +()0-9]{10,12}')]],
      email: ['', [Validators.pattern('^([a-zA-Z0-9\.-]+)@([a-zA-Z0-9-]+).[a-zA-Z]{2,4}$')]],
      address1: ['', [Validators.required]],
      // address2: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      country: ['-Select Country-', [Validators.required]],
      pincode: ['', [Validators.pattern('[- +()0-9]{10,12}')]],

      license_no: ['', [Validators.required]],
    });
    // console.log(this.userInfo);
    this.editUser(this.userInfo.id)
    // this.registerForm.controls['email'].disable();
    // this.registerForm.controls['first_name'].disable();
    // this.registerForm.controls['last_name'].disable();
    this.allCountryList();
    this.countryList = "-Select Country-"

    // this.registerForm.setValue({
    //   country: '-Select-'
    // })
    this.registerForm.controls['country'].setValue('-Select Country-')
    // this.monthly()
  }
  stateByCountry(e: any) {
    this.countryList = "-Select Country-"
    // console.log(e.target.value)
    this.userService.getStateByCountries({ name: e.target.value }).subscribe((res: any) => {
      // // console.log(res.getData[0].regions)
      this.registerForm.controls['state'].setValue('-Select State-')
      this.stateList = "-Select State-"
      this.allstates = res.getData[0].regions
      this.paypalCountry = this.allcountries.filter((elem: any) => elem.countryName == e.target.value)[0]?.countryShortCode
    })
  }
  getIPAddress() {
    this.http.get(environment.GEO_LOCATION).subscribe((res: any) => {
      const data = res;
      console.log(data.country,'lllllllllll')
      this.ipAddress = data.IPv4
      this.country = data.country;
      console.log(this.country, "ipAddress", data, this.monthlyAllData,'devvvvvv')
      this.planList();
    });
  }
  @Input() set autofocus(condition: boolean)
    {
        this.focus = condition !== false;
    }
  ngAfterViewInit(): void {
    // if(this.checked && this.subsId != 0){
    //   // console.log(this.paypalRef.nativeElement);

    //   window.paypal.Buttons(
    //     {
    //       style: {
    //         layout: "vertical"
    //       }
    //     }
    //   ).render(this.paypalRef.nativeElement)
    // }
    this.el.nativeElement.focus()
    // console.log(this.registerForm)
  }

  public initConfig(): void {
    //(<HTMLImageElement>document.querySelector(".paypal-logo")).src="";

    var modal = document.getElementById("launch_ad");
    modal.style.display = "none";

    this.payPalConfig = {
      currency: 'USD',
      clientId: 'sb',
      // clientId: 'AYCBFqGe2Tco1l33ZXvZXbdPKfPJVyqa2-NjAta0ytO1zR406yq2O66FkBI2_IdvKiRaUOcMPbTM-Ys_',
      // sercet_Key: 'EB7iibKAc300PD34UVfZC_ESm6XWeJsCRK9GZq0ccemEGL4pmb4Py_PYyLuozAeJdkUVNQ1N-CmTroM6',
      // ! for orders on client side
      // onInit: (data, actions) => {
      //   // console.log("OnInit", data, actions)
      //   // console.log(this.registerForm.value);
      //   // if (this.userInfo.id != "" && this.userInfo.id != undefined && this.userInfo.id != null) {
      //   //   this.userService.updateUser(this.registerForm.value, this.userInfo.id)
      //   //     .subscribe((res: any) => {
      //   //       if (res.success) {
      //   //         //this.toastr.success(res.message);
      //   //         // Swal.fire({
      //   //         //   text: res.message,
      //   //         //   icon: 'success',
      //   //         // });
      //   //         // console.log("DO HERE!!!!!!")
      //   //         this.paypalBtn = true;
      //   //         this.readOnly = true;
      //   //         this.payDisabled = false;
      //   //         document.getElementById("country").style.pointerEvents = 'none';
      //   //         return actions.enable()

      //   //         //  this.router.navigateByUrl('/registered-dentists');

      //   //       } else {
      //   //         Swal.fire({
      //   //           text: "All the fields are necessary to fill before payment.",
      //   //           icon: 'warning',
      //   //         });
      //   //         this.payDisabled = true;
      //   //         // this.payDisabledMsg = res.message;
      //   //         return actions.disable()

      //   //         //this.toastr.error(res.message);
      //   //       }
      //   //     });
      //   // }
      // },
      onClick: (data, actions) => {
        // console.log('onClick', data, actions);
        // console.log(this.registerForm.valid)
        // console.log(this.registerForm.value)
        // this.resetStatus();
        return this.userService.updateUser(this.registerForm.value, this.userInfo.id)
        .subscribe((res: any) => {
          if (res.success) {
            // Swal.fire({
            //   text: res.message,
            //   icon: 'success',
            // });
            this.paypalBtn = true;
            this.readOnly = true;
            this.payDisabled = false;
            document.getElementById("country").style.pointerEvents = 'none';
            // return actions.resolve();
            return true;
          } else {
            Swal.fire({
              text: res.message,
              icon: 'warning',
            });
            this.payDisabled = true;
            this.payDisabledMsg = res.message;
            // return actions.reject();
            return false;
          }
        });


        if(this.registerForm.value){
          // return actions.resolve();
        } else {

        }
        // return actions.reject();
      },
      createSubscription: (data) => <ICreateSubscriptionRequest>{
        // plan_id: '123456789'
      },
      createOrderOnClient: (data) => <ICreateOrderRequest>{

        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'USD',
            value: `${this.subsPrice}`,
            breakdown: {
              item_total: {
                currency_code: 'USD',
                value: `${this.subsPrice}`
              }
            },
          },
          items: [{
            name: 'ARTI',
            quantity: '1',
            category: 'DIGITAL_GOODS',
            unit_amount: {
              currency_code: 'USD',
              value: `${this.subsPrice}`,
            },
          }]
        }]
      },
      advanced: {
        commit: 'true',
      },
      style: {
        layout: 'horizontal',
        tagline: false,
        shape: 'rect',
        color: 'gold',
      },
      // createOrderOnServer: (data) => fetch('/my-server/create-paypal-transaction')
      //         .then((res) => res.json())
      //         .then((order) => order.orderID),
      onApprove: (data, actions) => {
        // console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then(details => {
          // console.log('onApprove - you can get full order details inside onApprove: ', details),

            //my code
            this.userService.getUserRecordById(this.userId).subscribe((res: any) => {
              console.log(res, "resssssssssssssssssssssssssssssssssssssss")
              this.userData = res.getData;
              // console.log(this.userData, this.userInfo, this.userInfo.token)

              if (res.success) {
                if (this.userData[0].subscription_details.status == true) {
                  Swal.fire({
                    text: "You have already subscribed",
                    icon: 'error',
                  });
                  return false;
                }

                else {

                  var end_date;
                  var now = new Date();
                  // console.log(this.subsType)
                  if (this.subsType == "Monthly") {


                    end_date = new Date(now.setMonth(now.getMonth() + 1));
                    end_date = new Date(now.setMinutes(now.getMinutes() + 5));
                    // console.log(end_date, "Date", new Date());

                  }
                  else if (this.subsType === "Yearly") {


                    end_date = new Date(now.setMonth(now.getMonth() + 12));

                    // console.log(end_date, "Date", new Date());

                  }
                }
              }
              this.userPlanData = {
                sub_id: this.subsId,
                type: this.subsType,
                name: this.subsTitle,
                price: this.subsPrice,
                country: this.subsCountry,
              }
              this.userService.getSubscription(this.userPlanData, this.userId).subscribe((res: any) => {
                // console.log(res)

                if (res.success) {
                  this.userInfo.subscribed = true;
                  localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
                  //this.toastr.success(res.message);
                  this.IsmodelShow = false;
                  // console.log(this.IsmodelShow);
                  ($("#myModal") as any).modal("hide");
                  //  this.handleClick();
                  // <HTMLElement>document.getElementById('myModal').modal("hide")

                  Swal.fire({
                    text: "You have successfully subscribed",
                    icon: 'success',
                  });
                  /*var modal= document.getElementById("launch_ad");
                   modal.style.display = "none";*/
                  if (this.userInfo.token != null && this.userInfo.token != undefined && this.userInfo.token != '') {
                    // console.log("iff")

                    this.router.navigateByUrl("/dashboard")
                  }
                  else {
                    // console.log("elseee")
                    this.router.navigateByUrl("/login")
                  }
                }
              })

            })
         });
      },
      // ! for orders on server side
      // createOrderOnServer: (data) => fetch('/my-server/create-paypal-transaction')
      //         .then((res) => res.json())
      //         .then((order) => order.orderID),
      //     onApprove: (data, actions) => {
      //         // console.log('onApprove - transaction was approved, but not authorized', data, actions);
      //         actions.order.get().then(details => {
      //             // console.log('onApprove - you can get full order details inside onApprove: ', details);
      //         });

      // },
      onClientAuthorization: (data) => {
        // console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        this.showSuccess = true;
      },
      onCancel: (data, actions) => {
        // console.log('OnCancel', data, actions);
        // this.checked = false;
        this.showCancel = true;
      },
      onError: err => {
        // console.log('OnError', err);
        this.showError = true;
      },
    };
  }
  allCountryList() {
    this.userService.getCountries().subscribe((res: any) => {
      // console.log(res.getData)
      this.allcountries = res.getData
    })
    this.registerForm.controls['country'].setValue('-Select Country-')
    this.countryList = "-Select Country-"
  }
  onchangeofthis(e: any){
    // // console.log("THIS", e)
    // console.log(this.registerForm.value, this.allcountries.filter((country:any) => country.countryName == this.registerForm.value.country)[0].countryShortCode)
    if(this.registerForm.value.first_name  && this.registerForm.value.last_name  && this.registerForm.value.email  && this.registerForm.value.contact_number  && this.registerForm.value.address1  && this.registerForm.value.city  && this.registerForm.value.country  && this.registerForm.value.state  && this.registerForm.value.pincode  && this.registerForm.value.license_no ){
      //this.paypalBtn = true;
    } else {
      //this.paypalBtn = false;
      this.dots = true
      setTimeout(() => {
        this.dots = false
      }, 1500)
    }
  }
  checkoutBtn() {
    this.IsmodelShow = true;
    // console.log(this.IsmodelShow);
    localStorage.setItem('i', this.userId)
  }
  resetStatus() {
    document.getElementById("launch_ad")?.click();
    // console.log("THIS IS RESET FOR PAYPAL");
    // console.log(this.subsPrice.toString(), this.subsTitle, this.subsType);
    if(!this.payDisabled){
      this.userService.updateUser(this.registerForm.value, this.userInfo.id)
            .subscribe((res: any) => {
              if (res.success) {
                // Swal.fire({
                //   text: res.message,
                //   icon: 'success',
                // });
                this.paypalBtn = true;
                this.readOnly = true;
                this.payDisabled = false;
                document.getElementById("country").style.pointerEvents = 'none';
                return true;
              } else {
                Swal.fire({
                  text: res.message,
                  icon: 'warning',
                });
                this.payDisabled = true;
                this.payDisabledMsg = res.message;
                return false;
              }
            });
    }
  }
  handleClose() {
    this.checked = false;
  }
  formChange(e: any){
    // // console.log(e)
  }
  onlyNumberKey(evt: KeyboardEvent) {
    // // console.log("THIS")
    // Only ASCII character in that range allowed
    let ASCIICode = (evt.which) ? evt.which : evt.keyCode;
    return (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) ? false : true;
  }
  checking(event) {
    this.checked = event.target.checked;
  }
  Logout() {
    Swal.fire({
      title: 'Are you sure?',
      //text: "You won't be Logout!",
     // icon: 'warning',
      imageUrl: '../../../../assets/images/warning.png',
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
          icon: 'success',
        });
        this.appService.logout();
      }
    });

  }
  planList() {
    this.userService.getSubscriptionList().subscribe((res: any) => {
      console.log(res, "response")
      if (res.success) {
        // console.log("plan fetched successfully")
        this.allData = res.getData
        setTimeout(() => {
          this.monthly()
        }, 2000)
      }
      else {
       // console.log("plan not fetched successfully")

      }
    })

  }



  monthly() {
    // this.monthlyAllData = this.allData.filter((elem) => {
    //   if(elem.type === "Monthly" && elem.country == this.country){
    //     return elem.type === "Monthly" && elem.country == this.country
    //   } else if(elem.type === "Monthly" && elem.country != this.country) {
    //     // console.log(elem.country, this.country, "DO THIS")
    //     return elem.type === "Monthly" && elem.country == "Others"
    //   }
    // })
    console.log(this.allData
      )
    if (this.countriesInHere.includes(this.country)) {
      this.monthlyAllData = this.allData.filter(elem => elem.type === "Monthly" && elem.country.includes(this.country))
    } else {
      this.monthlyAllData = this.allData.filter(elem => elem.type === "Monthly" && elem.country.includes("Others"))
    }
    console.log(this.country, this.monthlyAllData)
    this.yearlyAllData = []
    this.monthlyPlan = true;
    this.yearlyPlan = false;
    setTimeout(() => {
      if(this.monthlyAllData.length == 0){
        this.yearly()
      }
    }, 1000);

     //console.log(this.allData, this.yearlyAllData, this.monthlyAllData, this.subsId, this.country, this.allData, this.monthlyAllData.length);
  }

  yearly() {
    // this.yearlyAllData = this.allData.filter(elem => elem.type === "Yearly" && elem.country == this.country)

    // console.log(this.countriesInHere.includes(this.country))
    if (this.countriesInHere.includes(this.country)) {
      this.yearlyAllData = this.allData.filter(elem => elem.type === "Yearly" && elem.country.includes(this.country))
    } else {
      this.yearlyAllData = this.allData.filter(elem => elem.type === "Yearly" && elem.country.includes("Others"))
    }
    this.monthlyAllData = [];
    this.monthlyPlan = false;
    this.yearlyPlan = true;
    setTimeout(() => {
      if(this.yearlyAllData.length == 0 && this.monthlyAllData.length == 0){
        // console.log("NOTHING FOUND")
        this.noPlans = true;
      } else {
        this.noPlans = false;
      }
    }, 1500)
    // console.log(this.allData, this.yearlyAllData, this.monthlyAllData, this.monthlyPlan, this.subsId);
  }

  addMonths(date, months) {
    date.setMonth(date.getMonth() + months);

    return date;
  }
   //stripe by dev
   getSubscription(id, type, pricing_amount, title, country, stripeProductID, stripePriceID, currency) {
    console.log(id, type, pricing_amount, title, country, this.userSubscription, stripeProductID, stripePriceID, currency);
    //return
    this.subsId = id;
    this.subsType = type;
    this.subsPrice = pricing_amount;
    this.subsTitle = title;
    this.subsCountry = country;
    this.StripePriceID = stripePriceID;
    this.subscurrency = currency;
    // console.log(this.subsPaypalID)
    // let token = JSON.parse(localStorage.getItem('p-data')).token;
    // console.log(this.subsPaypalID)
    // console.log(`${this.localHost}pricing/${this.userId}/success`)
    // this.userService.paypalPayment(data).subscribe((res: any) => {
    //   console.log(res)
    //   this.paypal_ID = res.id;
    //   this.filterLink = res.links.filter(elem => elem.rel == "approve")
    //   console.log(this.filterLink,'lll')
    //   // this.router.navigateByUrl(this.filterLink[0].href)
    //   this.userPlanData = {
    //     sub_id: '',
    //     type: '',
    //     name: '',
    //     price: '',
    //     country: '',
    //     paypal_ID: res.id
    //   }
    // })
    console.log('this.StripePriceID', this.StripePriceID);
    
    localStorage.setItem('i', this.userId)
  }




   //paypal by rohit
  // getSubscription(id, type, pricing_amount, title, country, paypalID, paypalIDFree) {
  //   console.log(id, type, pricing_amount, title, country, this.userSubscription, paypalID, paypalIDFree);
  //   //return
  //   this.subsId = id;
  //   this.subsType = type;
  //   this.subsPrice = pricing_amount;
  //   this.subsTitle = title;
  //   this.subsCountry = country;
  //   if(this.userSubscription == 0){
  //     this.subsPaypalID = paypalIDFree;
  //     // console.log("NO LENGTH")
  //   } else if (this.userSubscription.length > 0){
  //     this.subsPaypalID = paypalID
  //     // console.log("LENGTH HERE")
  //   }
  //   // console.log(this.subsPaypalID)
  //   // let token = JSON.parse(localStorage.getItem('p-data')).token;
  //   // console.log(this.subsPaypalID)
  //   // console.log(`${this.localHost}pricing/${this.userId}/success`)
  //   let data = {
  //     "plan_id": this.subsPaypalID,
  //     // "start_time": "2018-11-01T00:00:00Z",
  //     // "quantity": "20",
  //     "auto_renewal": true,
  //     "shipping_amount": {
  //         "currency_code": "USD",
  //         "value": "0"
  //     },
  //     "subscriber": {
  //         "name": {
  //             "given_name": `${this.fname}`,
  //             "surname": `${this.lname}`
  //         },
  //         "email_address": `${this.mail}`,
  //         "shipping_address": {
  //             "name": {
  //                 "full_name": `${this.fname} ${this.lname}`
  //             },
  //             "address": {
  //                 "address_line_1": `${this.registerForm.value.address1}`,
  //                 "address_line_2": "",
  //                 "admin_area_2": `${this.registerForm.value.city}`,
  //                 "admin_area_1": `${this.paypalCountry}`,
  //                 "postal_code": `${this.registerForm.value.pincode}`,
  //                 "country_code": `${this.paypalCountry}`
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
  //         // "return_url": "https://darkmountain.blahworks.tech/success",
  //         // "cancel_url": "https://darkmountain.blahworks.tech/failure"
  //         "return_url": `${this.localHost}pricing/${this.userId}/success`,
  //         "cancel_url": `${this.localHost}pricing/${this.userId}/failure`
  //     }
  //   }
  //   this.userService.paypalPayment(data).subscribe((res: any) => {
  //     console.log(res)
  //     this.paypal_ID = res.id;
  //     this.filterLink = res.links.filter(elem => elem.rel == "approve")
  //     console.log(this.filterLink,'lll')
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
  //   localStorage.setItem('i', this.userId)


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
  buyNowFunc() {
    this.buyNow = true;
  }

  editUser(id: any) {
    this.userService.getUserRecordById(id).subscribe((res: any) => {
       console.log(res);
      this.userSubscription = res.getData[0].all_subscription_details;
      // console.log(this.userSubscription, "length")
      if (res.success) {
        this.registerForm.patchValue({
          first_name: res.getData[0].first_name,
        });

        this.registerForm.patchValue({
          last_name: res.getData[0].last_name,
        });

        this.registerForm.patchValue({
          contact_number: res.getData[0].contact_number,
        });

        this.registerForm.patchValue({
          email: res.getData[0].email,
        });

        this.registerForm.patchValue({
          address1: res.getData[0].address1,
        });

        // this.registerForm.patchValue({
        //   address2: res.getData[0].address2,
        // });
        this.registerForm.patchValue({
          city: res.getData[0].city,
        });
        this.registerForm.patchValue({
          state: res.getData[0].state,
        });
        this.registerForm.patchValue({
          country: res.getData[0].country,
        });
        this.countryList = res.getData[0].country ? res.getData[0].country : "-Select Country-"
        this.registerForm.patchValue({
          pincode: res.getData[0].pincode,
        });

        this.registerForm.patchValue({
          license_no: res.getData[0].license_no
        })
      }
    })
  }
  handleClickPayment(){
    // let token = JSON.parse(localStorage.getItem('p-data')).token;
    // // console.log(this.subsPaypalID)
    // let data = {
    //   "plan_id": this.subsPaypalID,
    //   // "start_time": "2018-11-01T00:00:00Z",
    //   // "quantity": "20",
    //   "shipping_amount": {
    //       "currency_code": "USD",
    //       "value": `${this.subsPrice}`
    //   },
    //   "subscriber": {
    //       "name": {
    //           "given_name": "John",
    //           "surname": "Doe"
    //       },
    //       "email_address": "sb-zhqmo25396320@personal.example.com",
    //       "shipping_address": {
    //           "name": {
    //               "full_name": "John Doe"
    //           },
    //           "address": {
    //               "address_line_1": "2211 N First Street",
    //               "address_line_2": "Building 17",
    //               "admin_area_2": "San Jose",
    //               "admin_area_1": "CA",
    //               "postal_code": "95131",
    //               "country_code": "US"
    //           }
    //       }
    //   },
    //   "application_context": {
    //       "brand_name": "ARTI",
    //       "locale": "en-US",
    //       "shipping_preference": "SET_PROVIDED_ADDRESS",
    //       "user_action": "SUBSCRIBE_NOW",
    //       "payment_method": {
    //           "payer_selected": "PAYPAL",
    //           "payee_preferred": "IMMEDIATE_PAYMENT_REQUIRED"
    //       },
    //       "return_url": "http://localhost:4200/dashboard",
    //       "cancel_url": "http://localhost:4200/login"
    //   }
    // }
    // this.userService.paypalPayment(data, token).subscribe((res: any) => {
    //   // console.log(res)
    //   this.filterLink = res.links.filter(elem => elem.rel == "approve")
    //   // this.router.navigateByUrl(this.filterLink[0].href)
    //   // console.log(this.filterLink[0].href)
    //   return;
    // })
  }

  //stripe by dev
  handleClick() {
    if (this.userInfo.id != "" && this.userInfo.id != undefined && this.userInfo.id != null) {
      this.userService.updateUser(this.registerForm.value, this.userInfo.id)
        .subscribe((res: any) => {
          if (res.success) {
             this.IsmodelShow = false;
             //($("#myModal") as any).modal("hide");
             console.log('dev')
            // this.paypalBtn = true;
            this.readOnly = true;
            document.getElementById("country").style.pointerEvents = 'none'
            this.userPlanData = {
              sub_id: this.subsId,
              type: this.subsType,
              name: this.subsTitle,
              price: this.subsPrice,
              country: this.subsCountry,
              stripePriceID: this.StripePriceID,
              currency:this.subscurrency
              //paypal_ID: this.paypal_ID
            }
            //console.log(this.filterLink[0]?.href, this.userId, this.userPlanData)
            console.log('dev')
            localStorage.setItem('i', this.userId)
            localStorage.setItem('sub', JSON.stringify(this.userPlanData));
            console.log('dev')
            //return;
            // localStorage.removeItem('userInfo')
            // this._location.prepareExternalUrl(this.filterLink[0].href)
            // this.document.location.href = this.filterLink[0].href
          } else {
            Swal.fire({
              text: res.message,
              icon: 'error',
            });
          }
          this.spinner.show()
          this.userService.getUserRecordById(this.userId).subscribe((res: any) => {
            //console.log(res, "resssssssssssssssssssssssssssssssssssssss")
            this.userData = res.getData;
            // console.log(this.userData, this.userInfo, this.userInfo.token)
            if (res.success) {
              this.spinner.hide()
              if (this.userData[0].subscription_details.status == true) {
                Swal.fire({
                  text: "You have already subscribed",
                  icon: 'error',
                });
                return false;
              }

              else{
                //console.log('dev')
                this.spinner.hide()
              //return
              let data = {price: this.StripePriceID }
              this.spinner.show()
              this.userService.createPrice(data)
                .subscribe((res: any) => { 
                  console.log(res.session.url)
                  this.spinner.hide()
                  localStorage.setItem('stripedata', JSON.stringify(res.session));
                  //console.log()
                  //return;
                  window.open(res.session.url, "_self");
                  if (res) {
                      
                   }else{
    
                  }  
              });
              }
            }else{
             
            }
        });
      });
    }
  }

  subscribeButtonClick() {
    let data = {price: this.StripePriceID }
    this.spinner.show()
    this.userService.createPrice(data)
      .subscribe((res: any) => { 
        console.log(res.session.url)
        this.spinner.hide()
        localStorage.setItem('stripedata', JSON.stringify(res.session));
        //console.log()
        //return;
        window.open(res.session.url, "_self");
        if (res) {
            
          }else{

        }  
    });
  }
  //paypal by rohit
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
  //   // console.log(this.registerForm.value);
  //   if (this.userInfo.id != "" && this.userInfo.id != undefined && this.userInfo.id != null) {
  //     this.userService.updateUser(this.registerForm.value, this.userInfo.id)
  //       .subscribe((res: any) => {
  //         if (res.success) {
  //           //this.toastr.success(res.message);
  //           // Swal.fire({
  //           //   text: res.message,
  //           //   icon: 'success',
  //           // });
  //           // this.userInfo.subscribed = true;
  //           // localStorage.setItem('userInfo', JSON.stringify(this.userInfo));
  //           // console.log("DO HERE!!!!!!")
  //           this.paypalBtn = true;
  //           this.readOnly = true;
  //           document.getElementById("country").style.pointerEvents = 'none';

  //           //  this.router.navigateByUrl('/registered-dentists');

  //           this.userPlanData = {
  //             sub_id: this.subsId,
  //             type: this.subsType,
  //             name: this.subsTitle,
  //             price: this.subsPrice,
  //             country: this.subsCountry,
  //             paypal_ID: this.paypal_ID
  //           }
  //           console.log(this.filterLink[0]?.href, this.userId, this.userPlanData)
  //           localStorage.setItem('i', this.userId)
  //           localStorage.setItem('sub', JSON.stringify(this.userPlanData));
  //           // localStorage.removeItem('userInfo')
  //           this._location.prepareExternalUrl(this.filterLink[0].href)
  //           this.document.location.href = this.filterLink[0].href
  //           // return;
  //           // this.userService.getSubscription(this.userPlanData, this.userId).subscribe((res: any) => {
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
  //               //   // console.log("iff")

  //                 // this.router.navigateByUrl("/dashboard")
  //               // }
  //               // else {
  //                 // // console.log("elseee")
  //                 // this.router.navigateByUrl("/login")
  //               // }
  //           //   }
  //           // })

  //         } else {
  //           Swal.fire({
  //             text: res.message,
  //             icon: 'error',
  //           });

  //           //this.toastr.error(res.message);
  //         }
  //       });
  //   }
  // }
  payView() {
    this.payData = {
      price: this.subsPrice
    }
    this.userService.paypalOrderReq(this.payData).subscribe((res: any) => {
      // console.log(res, location);
      location.href = res.link;
      // this.router.navigateByUrl(res.link)
    })
  }


  payBtn() {
    (<HTMLElement>document.getElementsByClassName('paypal-button paypal-button-number-0')[0]).click()
    // console.log("paypal")
  }
}





