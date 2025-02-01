import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-pay-failure',
  templateUrl: './pay-failure.component.html',
  styleUrls: ['./pay-failure.component.scss']
})
export class PayFailureComponent implements OnInit {
  title = 'ARTI - Failure';
  public id: any = localStorage.getItem('i') || '';

  constructor(private router: Router, private titleService: Title,){
    titleService.setTitle(this.title);
  }

  ngOnInit(): void {
    // localStorage.clear()
    setTimeout(() => {
      this.router.navigateByUrl('/pricing/'+this.id);
    }, 4000)
  }

  handleClick() {
  }
}
