import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-uploaded-xrays',
  templateUrl: './uploaded-xrays.component.html',
  styleUrls: ['./uploaded-xrays.component.scss']
})
export class UploadedXraysComponent {
  title = 'ARTI - Uploaded X-Rays';
  dtOptions: any = {};
  public subsEndDate: any[] = [];
  public allData: any;
  public userData : any;
n:any=0;
  private isDtInitialized: boolean = false;
   dtTrigger: Subject<any> = new Subject<any>();
   @ViewChild(DataTableDirective) dtElement: DataTableDirective;
  showContent: boolean;
  admin_pending: any=[];
  admin_eval: any=[];
  constructor( private userService : UserService,
    public route :ActivatedRoute,
    public router :Router,
    private titleService: Title,

  ) {
    titleService.setTitle(this.title);
  }

  ngOnInit(): void {
    // setTimeout(()=>this.showContent=true, 450);
    this.n=0;
    this.n =this.route.snapshot.paramMap.get('n');
    // console.log(this.n,"nn")
    this.dtOptions = {
      search:true,
      language: {
        search:"",
        searchPlaceholder: 'Search ',
      },
      buttons:[{
        extend: 'csv',
        text: 'Download CSV'
      }],
      paging: true,
      pagingType: 'full_numbers',
      pageLength: 10,

      responsive:true,
      dom: 'Bfrtip',
      order :[ [1,"date","desc"]

      ],
      "columnDefs": [{
      "targets": [0,2,3],

      "orderable": false
      }]


    };

    this.xrayList();
  }

  xrayList(){
    this.userService.getXrayList().subscribe((res:any) => {
      // console.log(res, "resssssssssssssssssssssssssssssssssssssss")
      this.allData = res.getData;
      //console.log(this.allData);
      this.admin_pending= this.allData.filter((elem) => {
        return elem.admin_marked_status===false;
        });
        this.admin_eval= this.allData.filter((elem) => {
          return elem.admin_marked_status===true;
          });
     console.log(this.admin_pending,this.admin_eval)

      /*for(let x = 0; x < this.allData.length; x++){
        // console.log(this.allData[x].user_id._id);
      }*/
      this.showContent=true;
         if (this.isDtInitialized) {
        this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
          dtInstance.destroy();
         // this.dtTrigger.next();
        });
      } else {
        this.isDtInitialized = true;
        //this.dtTrigger.next();
      }
    })



  }

  view(id){
    this.router.navigateByUrl('/view-admin-x-ray/' + id)
  }
  ngOnDestroy(): void {
  }
}
