import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

// import { EmailService } from '../email.service'; 
// import { StripeService } from '../subscription-list';  // Import the service

@Component({
  selector: 'app-form1',
  templateUrl: './form1.component.html',
  styleUrls: ['./form1.component.scss']
})

export class Form1Component {

  isSubmitted = false;
  
  ngOnInit() {
    this.setDynamicHeight();
  }
  @HostListener('window:resize')
  onResize() {
    this.setDynamicHeight();
  }
  private setDynamicHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  myForm: FormGroup;
  
  // mail
  loading: boolean = false;
  responseMessage: string | null = null;
  success: boolean = false;


  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    // private emailService: EmailService
  ) {
     this.myForm = this.fb.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      comments: ['', Validators.required],
      date: ['', Validators.required]
    });
   
  }

  // onSubmit() {
  //   if (this.myForm.valid) {
  //     console.log('Form Submitted', this.myForm.value);
  //     alert('Form submitted successfully!');
  //     this.myForm.reset();
  //   } else {
  //     alert('Please fill all required fields correctly.');
  //   }
  // }
  onSubmit() {
    if (this.myForm.valid) {
      const formData = this.myForm.value;

      this.http.post('http://localhost:4000/contact-form', formData).subscribe(
        (response) => {
          console.log('Email sent successfully:', response);
          this.isSubmitted = true;
          this.myForm.reset();
        },
        (error) => {
          console.error('Error sending email:', error);
        }
      );
    }
  }
  
  sendTestEmail() {
    this.loading = true;
    this.responseMessage = null; // Reset the message before making the request

    this.http.post('http://localhost:4000/send-email', {})
      .subscribe(
        (response: any) => {
          this.loading = false;
          this.success = true;
          this.responseMessage = response.message || 'Test email sent successfully!';
        },
        (error) => {
          this.loading = false;
          this.success = false;
          this.responseMessage = error.error.details || 'Failed to send test email.';
        }
      );
    }
    
  
  
}
// export class Form1Component {}
