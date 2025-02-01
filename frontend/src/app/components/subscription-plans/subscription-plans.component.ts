import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-subscription-plans',
  templateUrl: './subscription-plans.component.html',
  styleUrls: ['./subscription-plans.component.scss']
})
export class SubscriptionPlansComponent {
  @Input() monthlyPlans: any[] = [];
  @Input() yearlyPlans: any[] = [];
  @Input() userCountry: string = '';
  @Input() loading: boolean = true;
  
  showEmailModal: boolean = false;
  selectedPlan: any = null;

  selectPlan(plan: any) {
    // Store plan details in session storage
    sessionStorage.setItem('selected_plan', JSON.stringify(plan));
    this.selectedPlan = plan;
    this.showEmailModal = true;
  }

  closeEmailModal() {
    this.showEmailModal = false;
  }
} 