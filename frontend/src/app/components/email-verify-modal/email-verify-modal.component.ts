import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
declare var Swal: any;

@Component({
  selector: 'app-email-verify-modal',
  templateUrl: './email-verify-modal.component.html',
  styleUrls: ['./email-verify-modal.component.scss']
})
export class EmailVerifyModalComponent {
  @Input() show: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  
  emailForm: FormGroup;
  otpForm: FormGroup;
  showOtpInput: boolean = false;
  loading: boolean = false;
  error: string = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastr: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  sendOtp() {
    if (this.emailForm.valid) {
      this.loading = true;
      const email = this.emailForm.get('email')?.value;
      
      this.userService.sendOtp(email).subscribe({
        next: (response) => {
          if (response.success) {
            this.showOtpInput = true;
            this.toastr.success('OTP sent successfully. Please check your email.');
          } else {
            this.error = response.message;
            this.toastr.error(this.error);
          }
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          const errorMessage = error.error?.message || 'Failed to send OTP. Please try again.';
          this.error = errorMessage;
          this.toastr.error(errorMessage);
        }
      });
    }
  }

  verifyOtp() {
    if (this.otpForm.valid) {
      this.loading = true;
      const email = this.emailForm.get('email')?.value.toLowerCase();
      const otp = this.otpForm.get('otp')?.value.toString();

      console.log('Starting OTP verification for email:', email);

      this.userService.verifyOtp(email, otp).subscribe({
        next: (response) => {
          if (response.success) {
            sessionStorage.setItem('verified_email', email);
            
            const userData = {
              first_name: "user",
              last_name: "u",
              email: email,
              password: "admin1234",
              repassword: "admin1234",
              recaptcha: null,
              role: "dentist",
              accuracy: 0,
              country: [],
              subscription_details: {
                status: false,
                country: []
              },
              flag: 0,
              noOfXrayUploaded: 0,
              noOfXrayEvaluated: 0,
              noOfXrayMarkedByAdmin: 0,
              address1: null,
              address2: null,
              all_subscription_details: [],
              _logData: {
                action: 'USER_REGISTRATION',
                timestamp: new Date().toISOString()
              }
            };

            console.log('Registering user with data:', userData);

            this.userService.addUser(userData).subscribe({
              next: (registerResponse) => {
                if (registerResponse.success) {
                  const dentistId = registerResponse.data?._id;
                  console.log('Successfully registered dentist with ID:', dentistId);
                  
                  // Store dentist ID in session storage for payment flow
                  sessionStorage.setItem('dentist_id', dentistId);
                  
                  // Get selected plan from session storage
                  const selectedPlan = sessionStorage.getItem('selected_plan');
                  if (selectedPlan) {
                    const plan = JSON.parse(selectedPlan);
                    console.log('Selected plan details:', plan);
                    
                    // Store user ID for payment flow (same as pricing component)
                    localStorage.setItem('i', dentistId);
                    console.log('Stored dentist_id in localStorage as "i":', dentistId);

                    // Store plan data in localStorage (same as pricing component)
                    const userPlanData = {
                      sub_id: plan._id,
                      type: plan.type,
                      name: plan.plan_name,
                      price: plan.amount,
                      country: plan.country,
                      stripePriceID: plan.stripePriceID,
                      currency: plan.currency,
                      dentist_id: dentistId
                    };
                    localStorage.setItem('sub', JSON.stringify(userPlanData));
                    console.log('Stored plan data in localStorage:', userPlanData);

                    // Create price session with dentist_id
                    this.spinner.show();
                    let data = { 
                      price: plan.stripePriceID,
                      dentist_id: dentistId,
                      client_reference_id: dentistId,
                      metadata: {
                        dentist_id: dentistId,
                        plan_id: plan._id,
                        plan_type: plan.type,
                        user_email: email,
                        subscription_id: plan.stripePriceID,
                        plan_name: plan.plan_name,
                        amount: plan.amount,
                        currency: plan.currency
                      },
                      success_url: `${window.location.origin}/paymentsuccess/true?dentist_id=${dentistId}&session_id={CHECKOUT_SESSION_ID}&source=email_verify`,
                      cancel_url: `${window.location.origin}/pay/cancel?dentist_id=${dentistId}`
                    };
                    console.log('Creating price session with data:', data);

                    this.userService.createPrice(data).subscribe({
                      next: (res: any) => {
                        console.log('Price session created:', res);
                        this.spinner.hide();
                        this.loading = false;
                        this.closeModal.emit();
                        
                        if (res.session?.url) {
                          // Store stripe session data
                          const stripeData = {
                            ...res.session,
                            dentist_id: dentistId,
                            _logData: {
                              action: 'STRIPE_SESSION_CREATED',
                              dentist_id: dentistId,
                              session_id: res.session.id,
                              timestamp: new Date().toISOString()
                            }
                          };
                          localStorage.setItem('stripedata', JSON.stringify(stripeData));
                          console.log('Stored stripe session data:', stripeData);
                          console.log('Redirecting to payment URL for dentist_id:', dentistId);
                          
                          // Redirect to Stripe checkout
                          window.open(res.session.url, "_self");
                        } else {
                          console.error('No session URL in response:', res);
                          Swal.fire({
                            text: 'Failed to create checkout session',
                            icon: 'error',
                          });
                        }
                      },
                      error: (error) => {
                        console.error('Price session creation error:', error);
                        this.spinner.hide();
                        this.loading = false;
                        Swal.fire({
                          text: 'Failed to create checkout session',
                          icon: 'error',
                        });
                      }
                    });
                  } else {
                    console.error('No plan selected in session storage');
                    this.loading = false;
                    this.toastr.error('No plan selected');
                  }
                } else {
                  console.error('Registration failed:', registerResponse);
                  this.loading = false;
                  this.error = registerResponse.message;
                  this.toastr.error(this.error);
                }
              },
              error: (error) => {
                console.error('Registration error:', error);
                this.loading = false;
                this.error = error.error?.message || 'Registration failed';
                this.toastr.error(this.error);
              }
            });
          } else {
            console.error('OTP verification failed:', response);
            this.loading = false;
            this.error = response.message;
            this.toastr.error(this.error);
          }
        },
        error: (error) => {
          console.error('OTP verification error:', error);
          this.loading = false;
          this.error = error.error?.message || 'Invalid OTP';
          this.toastr.error(this.error);
        }
      });
    }
  }
} 

