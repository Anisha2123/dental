import { Component, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { DataTableDirective } from 'angular-datatables';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-dentists',
  templateUrl: './dentists.component.html',
  styleUrls: ['./dentists.component.scss']
})
export class DentistsComponent {
  dtOptions: DataTables.Settings = {};
  public allData: any;

  private isDtInitialized: boolean = false;
   dtTrigger: Subject<any> = new Subject<any>();
   @ViewChild(DataTableDirective) dtElement: DataTableDirective;
   showContent: boolean;

   constructor(
     private router: Router,
     private apiService: UserService,
   ) { }

   ngOnInit(): void {
     setTimeout(()=>this.showContent=true, 250);
     this.dtOptions = {
       pagingType: 'full_numbers',
       pageLength: 10,
       //dom: 'Bfrtip',

     };
     this.admin()

   }
   admin() {
     this.apiService.getUserList().subscribe((res:any) => {
       //// console.log(res, "resssssssssssssssssssssssssssssssssssssss")
       this.allData = res.getData;
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
   ngOnDestroy(): void {
     this.dtTrigger.unsubscribe();
   }



}
