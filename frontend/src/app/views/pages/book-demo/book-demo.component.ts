

import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-book-demo',
  templateUrl: './book-demo.component.html',
  styleUrls: ['./book-demo.component.scss'],
})
export class BookDemoComponent {
  demoForm: FormGroup;

   
  // mail
  loading: boolean = false;
  responseMessage: string | null = null;
  success: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.demoForm = this.fb.group({
      fname: ['', Validators.required],
      lname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      comments: ['', Validators.required],
      date: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.demoForm.valid) {
      console.log("in ts file");
      this.loading = true;
      const formData = this.demoForm.value;
      
      // this.http.post('/book-demo', formData).subscribe(
        this.http.post('http://localhost:4000/book-demo', formData).subscribe(
        (response: any) => {
          this.responseMessage = response.message;
          this.success = true;
          this.demoForm.reset();
        },
        (error) => {
          this.responseMessage = 'Something went wrong. Please try again.';
          this.success = false;
        },
        () => {
          this.loading = false;
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
