 import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import Swiper from 'swiper';
import { register } from 'swiper/element/bundle';
import { LocationService } from '../../../services/location.service';
import { switchMap } from 'rxjs/operators';

register();

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  title = 'my-home-page';
  userCountry: string = '';
  userState: string = '';
  loading = true;
  monthlyPlans: any[] = [];
  yearlyPlans: any[] = [];

  constructor(private locationService: LocationService) {}

  ngOnInit(): void {
    this.getUserLocationAndPlans();
    this.initializeAOSAndSwiper();
  }

  private getUserLocationAndPlans() {
    this.locationService.getUserLocation().pipe(
      switchMap(response => {
        this.userCountry = response.country;
        this.userState = response.regionName;
        console.log('User location:', {
          country: this.userCountry,
          state: this.userState,
          fullResponse: response
        });
        return this.locationService.getPlansForCountry(this.userCountry);
      })
    ).subscribe({
      next: (response) => {
        if (response.success) {
          const plans = response.getData || [];
          this.monthlyPlans = plans.filter((plan: any) => plan.plantype === 'month');
          this.yearlyPlans = plans.filter((plan: any) => plan.plantype === 'year');
          console.log('Plans loaded:', { monthly: this.monthlyPlans, yearly: this.yearlyPlans });  // Optional: For debugging
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error:', error);
        this.loading = false;
        // Set default country if location fetch fails
        this.userCountry = 'India';
        this.userState = '';
      }
    });
  }

  private initializeAOSAndSwiper() {
    AOS.init({
      startEvent: 'load',
    });

    setTimeout(() => {
      new Swiper(".testimonial", {
        slidesPerView: 1,
        spaceBetween: 30,
        autoplay: {
          delay: 3000
        },
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        breakpoints: {
          768: {
            slidesPerView: 2,
          }
        }
      });
    }, 1000);
  }
}
