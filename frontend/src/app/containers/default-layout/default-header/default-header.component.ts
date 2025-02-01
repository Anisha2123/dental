import { Component, EventEmitter, Input, Output, Pipe } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AppService } from 'src/app/services/app.service';
import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import Swal from 'sweetalert2';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent {
  @Input() sidebarId: string = "sidebar";
  @Output() toggleMenuSidebar: EventEmitter<any> = new EventEmitter<any>();
  toggle: boolean = true;
  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)
  public userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  intervalId: any;
  lName: any;
  fName: any;
  routerTo: any;
  noOfXrayEval: any = 0;
  noOfAiCavity: any = 0;
  count: any = 0;
  amtEarned: any = 0.00;
  xrayCount: any = 0;
  subCount: any = 0;
  unsubCount: any = 0;
  planCount: any = 0;
  totalCount: any = 0;
  public _router: any = "";
  public changeUrl: boolean = false;
  public dentist_count: any = 0;
  public accuracyOfSys: any = 0;
  public accuracyOfDent: any = 0;
  public countCavity: any = 0;
  public totalDCount: any = 0;
  public countDCavity: any = 0;

  constructor(private classToggler: ClassToggleService,
    private router: Router,
    private appService: AppService,
    private userService: UserService,
    private route: ActivatedRoute,
  ) {
    super();
    this._router = this.router.url
  }
  ngOnInit(): void {
    this.appService.getAccuracy();
    // console.log(this.userInfo)
    this.userfirst();
    // this.cavityCount();
    this.intervalId = setInterval(()=>{
      if(this.userInfo.token){
        this.allCountsAdmin();
        this.allCounts();
      }
    }, 15000)
    this.allCounts();
    this.allCountsAdmin();
    this.appService.currentUrl.subscribe((url: boolean) => {
      this.changeUrl = url
    })
    //this.admin()
    this.accuracyData()
  }
  ngOnDestroy(){
    clearInterval(this.intervalId);
  }
  accuracyData(){

  }
  allCounts() {
    this.appService.currentAccuracy.subscribe((acc: any) => {
      // console.log(acc, "ACCURACY")
      this.accuracyOfSys = acc
    })
    this.appService.currentAccuracyDent.subscribe((dent: any) => {
      // console.log(dent)
      this.accuracyOfDent = dent
    })
    this.userService.noOfXrayEvalByID(this.userInfo.id).subscribe((res: any) => {
      // console.log(res, res.dentist)
      if (res.success) {
        this.noOfXrayEval = res.getData;
        // console.log("noOfXray", this.noOfXrayEval)
        res.dentist.map((elem: any) => {
          // console.log(elem)
          elem.evaluation[0].dentist_correction.map((item: any) => {
            // console.log(item.value.rectanglelabels[0])
            if (item.value.rectanglelabels[0] == "Edit") {
              this.dentist_count += 1
            }
          })
        })
        // console.log(this.dentist_count)
      }
    })
    this.userService.noOfCavityByAI(this.userInfo.id).subscribe((res: any) => {
      // console.log(res)
      if (res.success) {
        this.noOfAiCavity = res.getData;
        // console.log("noOfXray", this.noOfAiCavity)
      }
      for (let i = 0; i < this.noOfAiCavity.length; i++) {
        if (this.noOfAiCavity[i].evaluation?.length > 0) {
          let n = this.noOfAiCavity[i].evaluation[0]?.ai_identified_cavities?.color_labels?.length
          if (n == undefined) {
            // console.log(n
            //  , "***")

          }
          else {
            this.count = this.count + this.noOfAiCavity[i].evaluation[0]?.ai_identified_cavities?.color_labels.length
            // console.log(this.count)
          }
        }
      }
      // console.log(this.count)
    })
    this.userService.handleTotalCavityCount().subscribe((res: any) => {
      // console.log(res, res.AICountF, "TOTAL CAVITY")
      if (res.success) {
        this.appService.updateCavitiesDetectedAI(res.AICountF)
        this.appService.currentCavitiesDetectedAI.subscribe((res: any) => {
          // console.log("UPDATIG HERE", res)
          // this.countCavity = res.AICountF
        })
        this.countCavity = res.AICountF
        this.totalCount = res.length
        // this.countDCavity = res.
      }
    })
  }
  cavityCount() {

  }
  allCountsAdmin() {
    this.userService.totAmtEarned().subscribe((res: any) => {
      // console.log(res)
      if (res.success) {
        this.amtEarned = res.getData;
        this.amtEarned = this.amtEarned.toFixed(2)
        // console.log("amtEarned", this.amtEarned)
      }
    })
    this.userService.noOfXrayEval().subscribe((res: any) => {
      if (res.success) {
        this.xrayCount = res.getData;
        // console.log("xraycount", this.xrayCount)
      }
    })
    this.userService.noOfSubscriber().subscribe((res: any) => {
      if (res.success) {
        this.subCount = res.getData;
        // console.log("subcount", this.subCount)
      }
    })
    this.userService.noOfUnsubscriber().subscribe((res: any) => {
      if (res.success) {
        this.unsubCount = res.getData;
        // console.log("unsubcount", this.unsubCount)
      }
    })
    this.userService.noOfPlans().subscribe((res: any) => {
      if (res.success) {
        this.planCount = res.getData;
        // console.log("plancount", this.planCount)
      }
    })
  }
  userfirst() {
    this.userInfo;
    // console.log(this.userInfo);
    // console.log(this.userInfo)
    let id = this.userInfo.id;
    this.userService.getUserRecordById(id).subscribe((res: any) => {
      // console.log(res, "++++++")
      if (res.success) {
        this.fName = res.getData[0]?.first_name;
        this.lName = res.getData[0]?.last_name;
      }
    })
    // console.log(this.fName)
  }
  dashboardFn(e: any) {
    // this.router.navigateByUrl("/dashboard")
    // console.log(this.router.url, this.changeUrl)
    if (this.changeUrl) {
      Swal.fire({
        title: 'Are you sure?',
        text: "Your progress will be lost!",
        //icon: 'warning',
        imageUrl: '../../../../assets/images/warning.png',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirm <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 3c-4.625 0-8.442 3.507-8.941 8.001H10v-3l5 4-5 4v-3H3.06C3.56 17.494 7.376 21 12 21c4.963 0 9-4.037 9-9s-4.037-9-9-9z"></path></svg>',
        showCloseButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            title: 'Success!',
            text: 'You Have Discarded The Image Successfully',
            //icon: 'success',
            imageUrl: '../../../../assets/images/success.png',
          });
          if (e == true) {
            // console.log(this.userInfo.id, 'dentist-profile')
            this.appService.updateGetUrl(false)
            this.router.navigateByUrl(`/dentist-profile/${this.userInfo.id}`);
          } else if (e == 'logout') {
            this.appService.updateGetUrl(false)
            this.appService.logout()
          }

          // this.userService.deleteXrayByID(id, {name: name}).subscribe((res: any) => {
          //   // console.log(res)
          //   if(res.success){
          //     this.router.navigateByUrl('/upload-xray/0');
          //   } else {
          //     Swal.fire({
          //       text: "Internal server error, image can't be deleted.",
          //       icon: 'error',
          //     });
          //   }
          // })
        }
      });
    }
  }
  Logout() {
    Swal.fire({
      title: 'Are you sure?',
      //text: "You won't be Logout!",
      //icon: 'warning',
      imageUrl: '../../../../assets/images/warning.png',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Logout! <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 3c-4.625 0-8.442 3.507-8.941 8.001H10v-3l5 4-5 4v-3H3.06C3.56 17.494 7.376 21 12 21c4.963 0 9-4.037 9-9s-4.037-9-9-9z"></path></svg>',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          title: 'Success!',
          text: 'You Have Been Successfully Logged-out',
          //icon: 'success',
          imageUrl: '../../../../assets/images/success.png',
        });
        this.appService.logout();
      }
    });

  }
  myProfile() {
    //this.router.navigateByUrl(`dentist-profile/`+this.userInfo.id)
    this.router.navigateByUrl('/dentist-profile/' + this.userInfo.id);
    // this.router.navigate([ '/dentist-profile' ], { queryParams: {dentist_id:this.userInfo.id } })
  }

  toggleSidebar(): boolean {
    return this.toggle = !this.toggle;
  }
}
