import { Component, ViewChild, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppService } from 'src/app/services/app.service';
import { UserService } from 'src/app/services/user.service';
import { DataTableDirective } from 'angular-datatables';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'app-upload-list',
  templateUrl: './upload-list.component.html',
  styleUrls: ['./upload-list.component.scss']
})
export class UploadListComponent implements OnInit {
  title = 'ARTI - Uploaded X-Rays';
  showContent: boolean;
  userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  public allData: any = []
  user_eval: any[];
  dtOptions: any = {};
  private isDtInitialized: boolean = false;
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  n: any = 0;
  xRayData: any = [];
  hidden: boolean;

  constructor(private userService: UserService,
    private spinner: NgxSpinnerService,
    public router: Router,
    public route: ActivatedRoute,
    private appService: AppService,
    private titleService: Title,) {
      titleService.setTitle(this.title);
    }

  public ngOnInit(): void {
    this.dtOptions = {
      search: true,
      searching: true,
      language: {
        search: "",
        searchPlaceholder: 'Search ',
      },
      buttons: [{
        sExtends: 'CSV',
        text: 'Download CSV'
      }],
      paging: true,
      pagingType: 'full_numbers',
      pageLength: 10,
      // ordering: false,
      responsive: true,
      // dom: 'Bfrtip',
      // order: [[0, "date", "desc"]

      // ],
      "columnDefs": [{
        "targets": [1, 2, 3],

        "orderable": false
      }]
    };
    this.getAllXrayOfUserById();
  }
  getAllXrayOfUserById() {
    this.userService.getUserXrayById(this.userInfo.id).subscribe((res: any) => {
      // console.log(res, "!!!!!!!!!!!!!!!!!!!!!!");
      this.allData = res.getData
      this.showContent = true;
      this.user_eval = this.allData.filter((elem) => {
        return elem.evaluation_status === true;
      });
      // console.log(this.user_eval)
      if (this.isDtInitialized) {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
          //  this.dtTrigger.next(this.allData);
          //  this.isDtInitialized = true;
          // var p = document.getElementsByClassName("paginate_button current").length;
          // // console.log(p,"ppp")
          this.dtTrigger.next(undefined);
        });
      } else {
        this.isDtInitialized = true;
        this.dtTrigger.next(undefined);
        //  var p = document.getElementsByClassName("paginate_button current");
        // // console.log(p,"ppp")
        //this.dtTrigger.next();
      }
    })
  }
  view(id) {
    this.router.navigateByUrl('/view-x-ray/' + id)
  }
  evaluate() {
    // [routerLink]="'/evaluate-x-ray'"
    // console.log(this.xRayData._id)
    // let id = this.xRayData._id
    this.router.navigateByUrl('/evaluate-x-ray');
    this.hidden = true;
    this.appService.updateGetUrl(true)
    localStorage.setItem('url', '0')
  }
}
