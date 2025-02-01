import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DefaultLayoutComponent } from './containers';
import { Page404Component } from './views/pages/page404/page404.component';
import { Page500Component } from './views/pages/page500/page500.component';
import { LoginComponent } from './views/pages/login/login.component';
import { RegisterComponent } from './views/pages/register/register.component';
import { RegisteredDentistsComponent } from './views/pages/registered-dentists/registered-dentists.component';
import { DentistProfileComponent } from './views/pages/dentist-profile/dentist-profile.component';
import { ManageSubscriptionComponent } from './views/pages/manage-subscription/manage-subscription.component';
import { SubscriptionListComponent } from './views/pages/subscription-list/subscription-list.component';
import { UploadedXraysComponent } from './views/pages/uploaded-xrays/uploaded-xrays.component';
import { MarkXrayComponent } from './views/pages/mark-xray/mark-xray.component';
import { RegisterFormComponent } from './views/pages/register-form/register-form.component';
import { PricingComponent } from './views/userPages/pricing/pricing.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { ForgetPasswordComponent } from './views/pages/forget-password/forget-password.component';
import { SetNewPasswordComponent } from './views/pages/set-new-password/set-new-password.component';
import { UploadXrayComponent } from './views/userPages/upload-xray/upload-xray.component';
import { UserAuthGuard } from './guard/user-auth.guard';
import { SubscribeAuthGuard } from './guard/subscribe-auth.guard';
import { EvaluateXrayComponent } from './views/userPages/evaluate-xray/evaluate-xray.component';
import { TestComponent } from './views/pages/test/test.component';
import { FinancialComponent } from './views/pages/financial/financial.component';
import { ViewXrayComponent } from './views/userPages/view-xray/view-xray.component';
import { ViewAdminXrayComponent } from './views/pages/view-admin-xray/view-admin-xray.component';
import { RenewSubComponent } from './views/userPages/renew-sub/renew-sub.component';
import { UserRolesAuthGuard } from './guard/user-roles-auth.guard';
import { SubsAuthGuard } from './guard/subs-auth.guard';
import { UserRoleDentistGuard } from './guard/user-role-dentist.guard';
import { DashboardProfileCheckGuard } from './guard/dashboard-profile-check.guard';
import { NonUserAuthGuard } from './guard/non-user-auth.guard';
import { PricingGuardGuard } from './guard/pricing-guard.guard';
import { PaySuccessComponent } from './views/pages/pay-success/pay-success.component';
import { PayFailureComponent } from './views/pages/pay-failure/pay-failure.component';
import { UploadListComponent } from './views/userPages/upload-list/upload-list.component';
import { PaymentSuccessComponent } from './views/pages/payment-success/payment-success.component';
import { HomeComponent } from './views/pages/home/home.component';
import { AboutComponent } from './views/pages/about/about.component';
import { Form1Component } from './views/pages/form1/form1.component';
import { BookDemoComponent } from './views/pages/book-demo/book-demo.component';
const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      title: 'Home',
    },
    canActivate: [],
  },
  {
    path: 'register',
    component: RegisterFormComponent,
    data: {
      title: 'Register',
    },
    canActivate: [],
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page',
    },
  },
  {
    path: 'test',
    component: TestComponent,
    data: {
      title: 'Test',
    },
  },
  {
    path: 'about',
    component: AboutComponent,
    data: {
      title: 'About',
    },
    canActivate: [],
  },
  {
    path: 'book-demo',
     component: BookDemoComponent,
     data:{
      title:'BookDemo',
     },
     canActivate: [],
  },      
  {
    path: 'form',
    component: Form1Component,
    data: {
      title: 'Form',
    },
    canActivate: [],
  },
  {
    path: 'failure',
    component: PayFailureComponent,
    data: {
      title: 'Pay Failure',
    },
  },
  {
    path: 'paymentsuccess/:payment_status',
    component: PaymentSuccessComponent,
    data: {
      title: 'Payment Success',
    },
  },
  {
    path: 'pricing/:dentist_id/:payment_status',
    component: PaySuccessComponent,
    data: {
      title: 'Pay Success',
    },
  },
  {
    path: 'forgot-password',
    component: ForgetPasswordComponent,
    data: {
      title: 'Forget password',
    },
  },
  {
    path: 'set-new-password',
    component: SetNewPasswordComponent,
    data: {
      title: 'Set New Password',
    },
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: '',
    },
    canActivate: [UserAuthGuard, SubscribeAuthGuard],
    children: [
      {
        path: 'widgets',
        loadChildren: () =>
          import('./views/widgets/widgets.module').then((m) => m.WidgetsModule),
      },
      {
        path: 'pages',
        loadChildren: () =>
          import('./views/pages/pages.module').then((m) => m.PagesModule),
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: {
          title: 'Dashboard',
        },
        canActivate: [DashboardProfileCheckGuard],
        children: [
          {
            path: '',
            loadChildren: () =>
              import('./views/dashboard/dashboard.module').then(
                (m) => m.DashboardModule
              ),
          },
        ],
      },
      {
        path: 'dentist-profile/:dentist_id',
        component: DentistProfileComponent,
        data: {
          title: 'Dentist Profile',
        },
        canActivate: [DashboardProfileCheckGuard],
      },
      {
        path: 'financial',
        component: FinancialComponent,
        data: {
          title: 'Financial',
        },
        canActivate: [UserRolesAuthGuard],
      },
      {
        path: 'subscription-list',
        component: SubscriptionListComponent,
        data: {
          title: 'Subscription Plans',
        },
        canActivate: [UserRolesAuthGuard],
      },
      {
        path: 'uploaded-xray/:n',
        component: UploadedXraysComponent,
        data: {
          title: 'Uploaded X-Rays',
        },
        canActivate: [UserRolesAuthGuard],
      },
      {
        path: 'mark-xray/:xray_id',
        component: MarkXrayComponent,
        data: {
          title: 'Mark X-Ray',
        },
        canActivate: [UserRolesAuthGuard],
      },
      {
        path: 'view-admin-x-ray/:xray_id',
        component: ViewAdminXrayComponent,
        data: {
          title: 'View X-Ray',
        },
        canActivate: [UserAuthGuard, UserRolesAuthGuard],
      },
      {
        path: 'upload-xray/:n',
        component: UploadXrayComponent,
        data: {
          title: 'Upload X-Ray',
        },
        canActivate: [UserRoleDentistGuard, SubsAuthGuard],
      },
      {
        path: 'registered-dentists',
        component: RegisteredDentistsComponent,
        data: {
          title: 'Registered Dentists',
        },
        canActivate: [UserAuthGuard, UserRolesAuthGuard],
        children: [
          {
            path: 'pending',
            component: RegisteredDentistsComponent,
            data: {
              title: 'Registered Dentists - Pending',
            },
            canActivate: [UserAuthGuard, UserRolesAuthGuard],
          },
          {
            path: 'complete',
            component: RegisteredDentistsComponent,
            data: {
              title: 'Registered Dentists - Complete',
            },
            canActivate: [UserAuthGuard, UserRolesAuthGuard],
          },
        ],
      },
      {
        path: 'evaluate-x-ray',
        component: EvaluateXrayComponent,
        data: {
          title: 'Evaluate X-Ray',
        },
        canActivate: [UserAuthGuard, UserRoleDentistGuard, SubsAuthGuard],
      },
      {
        path: 'view-x-ray/:xray_id',
        component: ViewXrayComponent,
        data: {
          title: 'View X-Ray',
        },
        canActivate: [UserAuthGuard, UserRoleDentistGuard, SubsAuthGuard],
      },
      {
        path: 'renew-sub/:dentist_id',
        component: RenewSubComponent,
        data: {
          title: 'Renew Sub',
        },
        canActivate: [UserAuthGuard, UserRoleDentistGuard, SubsAuthGuard],
      },
      {
        path: 'upload-xray-list',
        component: UploadListComponent,
        data: {
          title: 'Upload X-Rays',
        },
        canActivate: [UserAuthGuard, UserRoleDentistGuard, SubsAuthGuard],
      },
    ],
  },
  {
    path: 'pricing/:dentist_id',
    component: PricingComponent,
    data: {
      title: 'Subscription Plans',
    },
    canActivate: [PricingGuardGuard],
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      initialNavigation: 'enabledBlocking',
      // relativeLinkResolution: 'legacy'
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
