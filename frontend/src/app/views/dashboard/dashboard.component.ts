import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Title } from '@angular/platform-browser';
import { DashboardChartsData, IChartProps } from './dashboard-charts-data';
import { Router } from '@angular/router';

interface IUser {
  name: string;
  state: string;
  registered: string;
  country: string;
  usage: number;
  period: string;
  payment: string;
  activity: string;
  avatar: string;
  status: string;
  color: string;
}

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  title = 'ARTI - Dashboard';
  role: any;
  expTime: any;
  diffDays: any;
  diiTime: any;
  constructor(private chartsData: DashboardChartsData,
    private userService : UserService, private router: Router, private titleService: Title,) {
    titleService.setTitle(this.title);
  }
  userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  fName:string;
  lName:string;
  public users: IUser[] = [
    {
      name: 'Yiorgos Avraamu',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'Us',
      usage: 50,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Mastercard',
      activity: '10 sec ago',
      avatar: './assets/img/avatars/1.jpg',
      status: 'success',
      color: 'success'
    },
    {
      name: 'Avram Tarasios',
      state: 'Recurring ',
      registered: 'Jan 1, 2021',
      country: 'Br',
      usage: 10,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Visa',
      activity: '5 minutes ago',
      avatar: './assets/img/avatars/2.jpg',
      status: 'danger',
      color: 'info'
    },
    {
      name: 'Quintin Ed',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'In',
      usage: 74,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Stripe',
      activity: '1 hour ago',
      avatar: './assets/img/avatars/3.jpg',
      status: 'warning',
      color: 'warning'
    },
    {
      name: 'Enéas Kwadwo',
      state: 'Sleep',
      registered: 'Jan 1, 2021',
      country: 'Fr',
      usage: 98,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Paypal',
      activity: 'Last month',
      avatar: './assets/img/avatars/4.jpg',
      status: 'secondary',
      color: 'danger'
    },
    {
      name: 'Agapetus Tadeáš',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'Es',
      usage: 22,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'ApplePay',
      activity: 'Last week',
      avatar: './assets/img/avatars/5.jpg',
      status: 'success',
      color: 'primary'
    },
    {
      name: 'Friderik Dávid',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'Pl',
      usage: 43,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Amex',
      activity: 'Yesterday',
      avatar: './assets/img/avatars/6.jpg',
      status: 'info',
      color: 'dark'
    }
  ];
  public mainChart: IChartProps = {};
  public chart: Array<IChartProps> = [];
  public trafficRadioGroup = new UntypedFormGroup({
    trafficRadio: new UntypedFormControl('Month')
  });

  ngOnInit(): void {
    // // console.log(JSON.parse(localStorage.getItem("userInfo")), "SUBS", JSON.parse(localStorage.getItem("userInfo")).subscribed)
    // if(!JSON.parse(localStorage.getItem("userInfo")).subscribed){
    //   this.router.navigateByUrl('login')
    //   // console.log("Subs not found!!!!!!!!!")
    // }
    this.initCharts();
    // console.log(this.userInfo)
    let jwt = this.userInfo.token

    let jwtData = jwt.split('.')[1]
    let decodedJwtJsonData = window.atob(jwtData)
    let decodedJwtData = JSON.parse(decodedJwtJsonData);
    this.role=decodedJwtData.role;
  this.getSubExpireTime();
    let id= this.userInfo.id;
    this.userService.getUserRecordById(id).subscribe((res: any) =>{
      // console.log(res,"++++++")
      if(res.success){
  this.fName= res.getData[0]?.first_name;
  this.lName = res.getData[0]?.last_name;
      }
    })
    // console.log(this.fName)
  }

  initCharts(): void {
    this.mainChart = this.chartsData.mainChart;
  }

  setTrafficPeriod(value: string): void {
    this.trafficRadioGroup.setValue({ trafficRadio: value });
    this.chartsData.initMainChart(value);
    this.initCharts();
  }
  getSubExpireTime(){
    this.userService.getUserSubExpireTime(this.userInfo.id).subscribe((res: any) =>{
      // console.log(res,"++++++")
      if(res.success){
        // console.log(res)
        this.expTime=res.getData
        this.diffDays=res.diffDays;
        this.diiTime=res.diffTime;
        // console.log(this.expTime,this.diffDays,this.diiTime)
      }
    })
  }
}
