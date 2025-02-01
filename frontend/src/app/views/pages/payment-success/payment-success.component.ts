import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/services/app.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { Title } from '@angular/platform-browser';
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss']
})
export class PaymentSuccessComponent implements OnInit {
  public id: any = localStorage.getItem('i') || '';
  public userId: any;
  public token: any = localStorage.getItem('token');
  public btnStatus: boolean = false;
  title = 'ARTI';
  userPlanData: any;
  public payment_status: any;
  public show_text: any;
  public subs_detail: any;
  public userInfo: any = JSON.parse(localStorage.getItem('userInfo')) || {};
  public subPlan: any = JSON.parse(localStorage.getItem('sub')) || {};
  public stripeData: any = JSON.parse(localStorage.getItem('stripedata')) || {};
  public renewData: any = JSON.parse(localStorage.getItem('renew_sub')) || {};
  renew_subs: boolean;
  statusSubs: any;
  public subsType: any;

  constructor(private userService: UserService, private appService: AppService, private router: Router, private titleService: Title, private spinner: NgxSpinnerService, private route: ActivatedRoute, private toastr: ToastrService) {
    titleService.setTitle(this.title);
  }

  ngOnInit(): void {
    this.spinner.show();
    
    // Get email from session storage
    const verifiedEmail = sessionStorage.getItem('verified_email');
    const sessionId = this.route.snapshot.queryParamMap.get('session_id');

    if (!verifiedEmail) {
      this.toastr.error('User email not found');
      this.spinner.hide();
      return;
    }

    // Get stored plan data
    const planData = localStorage.getItem('sub');
    if (!planData) {
      this.toastr.error('No subscription data found');
      this.spinner.hide();
      return;
    }

    const subscriptionData = JSON.parse(planData);

    // Prepare data for subscription update
    const data = {
      email: verifiedEmail,
      sub_id: subscriptionData.sub_id,
      type: subscriptionData.type,
      name: subscriptionData.name,
      price: subscriptionData.price,
      country: subscriptionData.country,
      stripePriceID: subscriptionData.stripePriceID,
      currency: subscriptionData.currency,
      session_id: sessionId
    };

    // Call new API endpoint
    this.userService.updatePaymentSuccess(data).subscribe({
      next: (response: any) => {
        this.spinner.hide();
        if (response.success) {
          this.toastr.success('Subscription activated successfully');
          // Clear stored data
          localStorage.removeItem('sub');
          localStorage.removeItem('stripedata');
          sessionStorage.removeItem('verified_email');
          // Redirect to dashboard
          this.router.navigate(['/dashboard']);
        } else {
          this.toastr.error(response.message || 'Failed to activate subscription');
        }
      },
      error: (error) => {
        this.spinner.hide();
        console.error('Subscription update error:', error);
        this.toastr.error(error.error?.message || 'Failed to activate subscription');
      }
    });
  }
}
