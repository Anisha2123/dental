import { Component } from '@angular/core';
import { FormControl, FormGroup, NgForm, ValidationErrors, Validators, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { AppService } from 'src/app/services/app.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';
// import { ReCaptchaV3Service } from 'ng-recaptcha';
// import { ReCaptchaV3Service } from 'ng-recaptcha';

const ALPHA_NUMERIC_REGEX = /^(?=.*[0-9])(?=.*[a-zA-Z])(?=\S+$).{7,20}$/;
const ALPHA_NUMERIC_VALIDATION_ERROR = { alphaNumericError: 'only alpha numeric values are allowed' }
const REGEX = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})

export class RegisterFormComponent {
  title = 'ARTI - Registration';
  public registerForm: FormGroup;
  newUser: any;
  isAuthLoading: boolean;
  countryList = "-Select-";
  constructor(
    private titleService: Title,
    private toastr: ToastrService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private appService: AppService,
    private fb: FormBuilder,
    // private recaptchaV3Service: ReCaptchaV3Service,
  ) {
    titleService.setTitle(this.title);
  }

  ngOnInit() {
    // let p_data = {
    //   token: 'A21AAIkrNT4uw6k5IbT5mFWZT0Fefx_kDg767QqDDf9hP-L1hkAiINAtTtAgC6B6yu-KHHMu3_Ovs4pDRtONOYULiY9ggR2Mg',
    //   prod_id: 'PROD-2SV05090KF783042A'
    // }
    // localStorage.setItem('p-data', JSON.stringify(p_data))
    function alphaNumericValidator(control: FormControl): ValidationErrors | null {
      return ALPHA_NUMERIC_REGEX.test(control.value) ? null : ALPHA_NUMERIC_VALIDATION_ERROR;
    }
    // this.renderer.addClass(document.querySelector('app-root'), 'register-page');
    this.registerForm = new FormGroup({
      first_name: new FormControl(null, Validators.required),
      last_name: new FormControl(null, Validators.required),
      email: new FormControl(null, [Validators.pattern('^([a-zA-Z0-9\.-]+)@([a-zA-Z0-9-]+).[a-zA-Z]{2,4}$')]),
      // contact_number: new FormControl(null, Validators.required),
      // address1: new FormControl(null, Validators.required),
      // pincode: new FormControl(null, Validators.required),
      // city: new FormControl(null, Validators.required),
      // state: new FormControl(null, Validators.required),
      // country: new FormControl(null, Validators.required),
      password: new FormControl(null, [Validators.required, Validators.minLength(7), Validators.maxLength(10), alphaNumericValidator]),
      repassword: new FormControl(null, [Validators.required, Validators.minLength(7), Validators.maxLength(10), alphaNumericValidator]),
      recaptcha: new FormControl(null, [Validators.required]),
      // age: new FormControl(null, Validators.required)
    });
    // this.registerForm = this.fb.group({
    //   first_name: [null, Validators.required],
    //   last_name: [null, Validators.required],
    //   email: [null, [Validators.pattern('^([a-zA-Z0-9\.-]+)@([a-zA-Z0-9-]+).[a-zA-Z]{2,4}$')]],
    //   password: [null, [Validators.required, Validators.minLength(7), Validators.maxLength(10), alphaNumericValidator]],
    //   repassword: [null, [Validators.required, Validators.minLength(7), Validators.maxLength(10), alphaNumericValidator]],
    //   recaptcha: [null, [Validators.required]],
    // })
  }
  onSomeAction(event: any) {
    if (event.key == "Enter") {
      this.register()
    }
  }
  onlyNumberKey(evt: KeyboardEvent) {
    // Only ASCII character in that range allowed
    let ASCIICode = (evt.which) ? evt.which : evt.keyCode;
    return (ASCIICode > 31 && (ASCIICode < 48 || ASCIICode > 57)) ? false : true;
  }
  resolved(captchaResponse: string) {
    // console.log(`Resolved captcha with response: ${captchaResponse}`);
  }
  register() {
    // console.log(this.registerForm.value, !this.registerForm.value.email != true)
    if (
      this.registerForm.value.first_name == undefined ||
      this.registerForm.value.first_name.trim() == ''
    ) {
      Swal.fire({
        text: 'Please enter first name',
        icon: 'warning'
      });
      return false;
      // this.toastr.error('Please enter plan name');
      // return false;
    }
    if (
      this.registerForm.value.last_name == undefined ||
      this.registerForm.value.last_name.trim() == ''
    ) {
      Swal.fire({
        text: 'Please enter last name',
        icon: 'warning'
      });
      return false;
      // this.toastr.error('Please enter plan name');
      // return false;
    }
    if (
      this.registerForm.value.email == undefined ||
      this.registerForm.value.email.trim() == ''
    ) {
      Swal.fire({
        text: 'Please enter email',
        icon: 'warning'
      });
      return false;
      // this.toastr.error('Please enter plan name');
      // return false;
    }
    if(!REGEX.test(this.registerForm.value.email.trim())){
      Swal.fire({
        text: 'Invalid email address',
        icon: 'warning'
      });
      return false;
    }
    // if(this.registerForm.value.contact_number == undefined ||
    //   this.registerForm.value.contact_number == '') {
    //     Swal.fire({
    //       text: 'Please enter contact number',
    //       icon: 'warning'
    //     });
    //     return false;
    // }

    // if(this.registerForm.value.address1 == undefined ||
    //   this.registerForm.value.address1.trim() == '') {
    //     Swal.fire({
    //       text: 'Please enter address',
    //       icon: 'warning'
    //     });
    //     return false;
    // }
    // if(this.registerForm.value.pincode == undefined ||
    //   this.registerForm.value.pincode == '') {
    //     Swal.fire({
    //       text: 'Please enter zip',
    //       icon: 'warning'
    //     });
    //     return false;
    // }
    // if(this.registerForm.value.city == undefined ||
    //   this.registerForm.value.city.trim() == '') {
    //     Swal.fire({
    //       text: 'Please enter city',
    //       icon: 'warning'
    //     });
    //     return false;
    // }
    // if(this.registerForm.value.state == undefined ||
    //   this.registerForm.value.state.trim() == '') {
    //     Swal.fire({
    //       text: 'Please enter state',
    //       icon: 'warning'
    //     });
    //     return false;
    // }
    // if(this.registerForm.value.country == undefined ||
    //   this.registerForm.value.country == '-Select-') {
    //     Swal.fire({
    //       text: 'Please select country',
    //       icon: 'warning'
    //     });
    //     return false;
    // }
    // if(this.registerForm.value.age == undefined || this.registerForm.value.age == ''){
    //   Swal.fire({
    //     text: 'Please enter age',
    //     icon: 'warning'
    //   });
    //   return false;
    // }
    if (
      this.registerForm.value.password == undefined ||
      this.registerForm.value.password.trim() == ''
    ) {
      Swal.fire({
        text: 'Please enter password',
        icon: 'warning'
      });
      return false;
      // this.toastr.error('Please enter plan name');
      // return false;
    }
    if (!ALPHA_NUMERIC_REGEX.test(this.registerForm.value.password) || this.registerForm.value.password.length < 7) {
      Swal.fire({
        text: 'Password must contain atleast 7 characters, one letter and one number',
        icon: 'warning'
      });
      return false;
    }
    if(this.registerForm.value.repassword == undefined ||
      this.registerForm.value.repassword.trim() == '') {
        Swal.fire({
          text: 'Please enter confirm password',
          icon: 'warning'
        });
        return false;
    }
    if(this.registerForm.value.password.trim() !== this.registerForm.value.repassword.trim()){
        Swal.fire({
          text: 'Password does not match with confirm password.',
          icon: 'error'
        });
      return false;
    }

    // this.newUser= this.registerForm.value;
    // console.log()
    if(!this.registerForm.value.email != true){
      this.registerForm.value.email = this.registerForm.value.email.toLowerCase().trim();
    }

    this.userService.addUser(this.registerForm.value).subscribe((res: any) => {
      if (res.success) {
        // this.userService.payPalTokenGen(null).subscribe((res: any) => {
        //   if(res.access_token){
        //     localStorage.setItem('p-token', res.access_token)
        //   }
        // })
        //this.toastr.success(res.message);
     /*   Swal.fire({
          text: res.message,
          icon: 'success',
        });*/
        let loginData = {
          email: this.registerForm.value.email.toLowerCase().trim(),
          password: this.registerForm.value.password.trim()
        };

        this.userService.onLogin(JSON.stringify(loginData)).subscribe((result: any) => {
           //console.log(result);

        //  let id = result.userInfo.id;
          if (result.success) {
            //  this.userService.getUserRecordById(id).subscribe((res: any) => {
            // console.log(res, "*****");
            this.isAuthLoading = false;

            //this.toastr.success(result.message);
            // this.appService.login(result);})
            //!  changed here
           // this.router.navigateByUrl('/pricing/' + id);
            //  this.router.navigateByUrl('/login');
            this.appService.login(result)
          }
        })
        //   this.appService.login(result);
        /*localStorage.setItem('userInfo', JSON.stringify(this.registerForm.value['userInfo']));
         localStorage.setItem('id', getLoginDetail.userInfo.id);
         localStorage.setItem('email', getLoginDetail.userInfo.email);
         localStorage.setItem('role', getLoginDetail.userInfo.role);
         localStorage.setItem('objId', getLoginDetail.userInfo.objId);
         localStorage.setItem('isSub', getLoginDetail.userInfo.subscribed);*/

      }


      else {
        Swal.fire({
          text: res.message,
          icon: 'error',
        });
        //this.toastr.error(res.message);
      }
    })
  }

  handleForm(data: NgForm) {
    // console.log(data);
  }
  // countryList = "-Select-";
}
