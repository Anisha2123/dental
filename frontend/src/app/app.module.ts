import { NgModule, forwardRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {  LocationStrategy, PathLocationStrategy } from '@angular/common';
import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RECAPTCHA_V3_SITE_KEY, RecaptchaV3Module, RecaptchaFormsModule, RecaptchaModule, RECAPTCHA_SETTINGS, RecaptchaSettings } from 'ng-recaptcha';
// import { RecaptchaModule } from "ng-recaptcha";

// ! change environment variable before making build
import { environment } from '../environments/environment';

import { DataTablesModule } from 'angular-datatables';
import { ToastrModule } from 'ngx-toastr';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';


import {  } from 'ngx-toastr';
// Import routing module
import { AppRoutingModule } from './app-routing.module';

// Import app component
import { AppComponent } from './app.component';

// Import containers
import {
  DefaultFooterComponent,
  DefaultHeaderComponent,
  DefaultLayoutComponent,
} from './containers';

// import owl
// import { CarouselModule } from 'ngx-owl-carousel-o';

import {
  AvatarModule,
  BadgeModule,
  BreadcrumbModule,
  ButtonGroupModule,
  ButtonModule,
  CardModule,
  DropdownModule,
  FooterModule,
  FormModule,
  GridModule,
  HeaderModule,
  ListGroupModule,
  NavModule,
  ProgressModule,
  SharedModule,
  SidebarModule,
  TabsModule,
  UtilitiesModule,

} from '@coreui/angular';
//label studio
// import LabelStudio from "label-studio";

// paypal
import { NgxPayPalModule } from 'ngx-paypal';

import { NgxSpinnerModule } from "ngx-spinner";
// import Ngx

import { IconModule, IconSetService } from '@coreui/icons-angular';
import { PricingComponent } from './views/userPages/pricing/pricing.component';
import { DentistsComponent } from './views/dentists/dentists.component';
import { UploadXrayComponent } from './views/userPages/upload-xray/upload-xray.component';
import { EvaluateXrayComponent } from './views/userPages/evaluate-xray/evaluate-xray.component';
import { ViewXrayComponent } from './views/userPages/view-xray/view-xray.component';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { RenewSubComponent } from './views/userPages/renew-sub/renew-sub.component';
import { DragDropDirective } from './drag-drop.directive';
import { DentistProfileComponent } from './views/pages/dentist-profile/dentist-profile.component';
import { ResetPasswordComponent } from './views/pages/reset-password/reset-password.component';
import { UploadListComponent } from './views/userPages/upload-list/upload-list.component'
// import { RegisterFormComponent } from './views/pages/register-form/register-form.component';
import { AuthinterceptorInterceptor } from 'src/app/utils/authinterceptor.interceptor'
import { TooltipModule } from 'ng2-tooltip-directive';
//import { PaymentSuccessTrueComponent } from './pages/payment-success-true/payment-success-true.component';
import { CommonModule } from '@angular/common';
import { SubscriptionPlansComponent } from './components/subscription-plans/subscription-plans.component';
import { HomeComponent } from './views/pages/home/home.component';
import { EmailVerifyModalComponent } from './components/email-verify-modal/email-verify-modal.component';
import { AboutComponent } from './views/pages/about/about.component';
import { Form1Component } from './views/pages/form1/form1.component';
// import { HomeComponent } from './views/pages/home/home.component';
// import { PricingComponent } from './views/userPages/pricing/pricing.component';
import { BookDemoComponent } from './views/pages/book-demo/book-demo.component'; 


const APP_CONTAINERS = [
  DefaultFooterComponent,
  DefaultHeaderComponent,
  DefaultLayoutComponent,
];

@NgModule({
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    PricingComponent,
    DentistsComponent,
    UploadXrayComponent,
    EvaluateXrayComponent,
    ViewXrayComponent,
    RenewSubComponent,
    DragDropDirective,
    DentistProfileComponent,
    ResetPasswordComponent,
    UploadListComponent,
    SubscriptionPlansComponent,
    HomeComponent,
    EmailVerifyModalComponent,
    AboutComponent, 
    Form1Component,
     HomeComponent,
     BookDemoComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AvatarModule,
    BreadcrumbModule,
    FooterModule,
    DropdownModule,
    GridModule,
    HeaderModule,
    SidebarModule,
    IconModule,
    NavModule,
    ButtonModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    RecaptchaV3Module,
    FormModule,
    UtilitiesModule,
    ButtonGroupModule,
    ReactiveFormsModule,
    SidebarModule,
    SharedModule,
    TabsModule,
    ListGroupModule,
    ProgressModule,
    BadgeModule,
    ListGroupModule,
    CardModule,
    DataTablesModule,
    HttpClientModule,
    FormsModule,
    // CarouselModule,
    NgxImageZoomModule,
    ToastrModule.forRoot({
      positionClass :'toast-bottom-right'
    }),
    NgxPayPalModule,
   
    NgxSpinnerModule,
    TooltipModule 
    
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthinterceptorInterceptor,
      
      multi: true,
    },
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy,
    },
    IconSetService,
    Title,
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: {
        siteKey: environment.recaptcha.siteKey,
      } as RecaptchaSettings,
    },
    // {
    //   provide: RECAPTCHA_V3_SITE_KEY,
    //   useValue: environment.recaptcha.siteKey,
    // },
    // {
    //   provide: NG_VALUE_ACCESSOR,
    //   multi: true,
    //   useExisting: RegisterFormComponent,
    // }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {
}

