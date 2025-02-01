import { Component } from '@angular/core';
import { ActivatedRoute ,Router} from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import LabelStudio from 'label-studio';
import { event } from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-view-admin-xray',
  templateUrl: './view-admin-xray.component.html',
  styleUrls: ['./view-admin-xray.component.scss']
})
export class ViewAdminXrayComponent {

  evaluationResult: boolean = false;

  markData: any=[];
  userMark: any=[];
  AIMarkData: any;
  // is equal to default value of input range
  constructor(private route: ActivatedRoute,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private router: Router,) {

  }

  valInput = '25';
  leftPos = `25%`;
  marker: any;
  xRayData: any = [];
  userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  baseLink: string = environment.FILE_HOST;
  id: any;
  labelStudio: any;
  marks_array: any = [];
  annotations: any;
  totalAI:number=0;
  cavity:any;
  onRangeChange(event: any) {
    this.valInput = (<HTMLInputElement>event.target).value.trim();
    this.leftPos = `${+(<HTMLInputElement>event.target).value.trim() - 5}%`
  }

  ngOnInit() {

    this.id = this.route.snapshot.paramMap.get('xray_id');
    this.spinner.show();
    this.getXray(this.id);
    this.getMark(this.id);
    /* setTimeout(() => {

       this.createLabelStudio()
     }, 1000);*/
    //this.createLabelStudio();
  }
  getXray(id) {

    this.userService.getXray(id).subscribe((res: any) => {
      if (res.success) {
        this.xRayData = res.getData;
        // console.log(this.xRayData[0]?.xray_image)
      //  fetch(this.xRayData[0]?.xray_image.path)
       //   .then(result => // console.log(result.url))
        //// console.log(a)

        this.createLabelStudio1()

      }
      else {
        return res.messages;
      }
    })
  }

  /*async getImageFileFromUrl(url,type){
    let response = await fetch(url);
    let data = await response.blob();
    let metadata = {
      type: type
    };
    return new File([data], "result.jpg", metadata);
  }


 async defaultApi(){
    var myHeaders = new Headers();
myHeaders.append("Authorization", "Bearer my-secret-auth-token");
myHeaders.append('Access-Control-Allow-Origin', "*");
myHeaders.append('Access-Control-Allow-Headers', "*");
myHeaders.append('Access-Control-Allow-Origin', 'http://localhost:4200');


const file = await this.getImageFileFromUrl(this.xRayData[0]?.xray_image.path, this.xRayData[0]?.xray_image.mimeType);
// console.log(file,"fileObj")
var formdata = new FormData();
formdata.append("image", file);

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: formdata,
  redirect: 'follow'
};

fetch("https://admin-scm.blahworks.tech/upload/image", {
  method: 'POST',

  headers: myHeaders,
  body: formdata,
  redirect: 'follow'
})
  .then(response => response.text())
  .then(result => // console.log(result))
  .catch(error => // console.log('error', error));
  }*/


  getMark(id) {
    // console.log(id)
     this.userService.getEvalById(id).subscribe((res: any) => {
      // console.log("getMark")
      if (res.success) {
        this.markData = res.getData;
        // console.log(this.markData)
        this.userMark = this.markData.admin_correction
        //this.AIMarkData = this.markData.ai_identified_cavities;
        // console.log(this.userMark, "***")
        this.createLabelStudio()
        this.createLabelStudio1()
        setTimeout(() => {
          this.spinner.hide();
        }, 1000);
      }
      else {
        // console.log("error")
      }
    })
  }

  //label-studio
  createLabelStudio1() {
     this.labelStudio = new LabelStudio('label-studio1',
{
        config: `
        <View style="display:row; flex-direction: column;">
        <Style> .Controls_wrapper__1Zdbo { display:none; }</Style>
        <Style>.Segment_block__1fyeG {background:transparent !important; border:none; margin-right:0px !important}</Style>
        <Style> .Hint_main__1Svrz { display:none; }</Style>
        <Style>.ant-tag {background-color:#02d959 !important; color:white !important; font-weight:bold !important;border:none !important}</Style>
       <View style="margin-top: -14px;">
       <Style> .ImageView_container__AOBmH img</Style>
       <Image name="img" value="$image" width="100%" height="100%" ></Image>
       <Style> canvas { width:100%; height:100% !important }</Style>
       </View>
 <View style="flex: 10%;float:right">
 <RectangleLabels name="label" toName="img" background="red">
 <!--<Label value="Add Mark" background="#8b0000" />-->
 </RectangleLabels>
 </View>
 </View>
 `,

        interfaces: [
          // "panel",
          //"update",
          // "submit",
          // "controls",
          /*"side-column",
          "annotations:menu",
          "annotations:add-new",
          "annotations:delete",
          "predictions:menu",*/
        ],

        /* user: {
           pk: 1,
           firstName: "James",
           lastName: "Dean"
         },*/

        task: {
          annotations: [],
          predictions: [],
          // id: 1,
          data: {
            image: this.baseLink + this.xRayData[0]?.xray_image.path
          }

        },

        onLabelStudioLoad: function (LS: { annotationStore: { addAnnotation: (arg0: { userGenerate: boolean; }) => any; selectAnnotation: (arg0: any) => void; }; }) {
          var c = LS.annotationStore.addAnnotation({
            userGenerate: true
          });

          LS.annotationStore.selectAnnotation(c.id);
        },
        onSubmitAnnotation: async function (LS, annotation) {
          // console.log(annotation.serializeAnnotation());


        },
        onUpdateAnnotation: async function (LS, annotation) {
          // console.log(annotation.serializeAnnotation());

        }


      });


    return this.labelStudio;

  }

  handleSwitch(text: any){
    if(text == 'show'){
      this.evaluationResult = false;
      // this.displayImg();
      this.getMark(this.id);
    } else if (text == 'hide'){
      this.evaluationResult = true;
    }
   }

  createLabelStudio() {
    const resultArrUser = this.userMark.map((element: any) => {
      let obj = {
        "from_name": "label",
        "id": element.id,
        "type": "rectanglelabels",
        "source": "$image",
        "readonly": false,
        "canrotate": false,
        // "original_width":this.userMark[1]?.original_height,
        "original_width": element.original_width,
        "original_height": element.original_height,
        "image_rotation": 0,
        "to_name": "img",

        "fillColor": "#00ff00",
        "background": "green",
        "value":
        {
          "x": element.value.x,
          "y": element.value.y,
          "width": element.value.width,
          "height": element.value.height,
          "rotation": 0,
          "rectanglelabels": [
            element.value.rectanglelabels[0]
          ]
        }



      }

      // console.log(obj)
      return obj;
      // return element.original_width
    })

  //  const resultArr = resultArrUser.concat(resultArrAI)
    this.labelStudio = new LabelStudio('label-studio', {
      config: `
      <View style="display:row; flex-direction: column;">
      <Style> .Controls_wrapper__1Zdbo { display:none; }</Style>
      <Style>.Segment_block__1fyeG {background:transparent !important; border:none; margin-right:0px !important}</Style>
      <Style> .Hint_main__1Svrz { display:none; }</Style>
      <Style>.ant-tag {background-color:#02d959 !important; color:white !important; font-weight:bold !important;border:none !important}</Style>
     <View style="margin-top: -14px;">
     <Style> .ImageView_container__AOBmH img</Style>
     <Image name="img" value="$image" width="100%" height="100%" ></Image>
     <Style> canvas { width:100%; height:100% !important }</Style>
     </View>

 <View style="flex: 10%;float:right;display:none">
 <RectangleLabels name="label" toName="img" background="red" opacity="0.5" strokeWidth="6">
 <Label value="1" background="#FF3131" />
 <Label value="2" background="#FFFF00" />
 <Label value="Make Corrections" background="green" />
 <Label value="Admin Correction" background="#FF7420" />
 </RectangleLabels>

 </View>

 </View>
 `,

      interfaces: [
        // "panel",
       // "update",
        //"submit",
       // "controls",
       // "side-column",
       // "annotations:menu",
       // "annotations:add-new",
       // "annotations:delete",
        //"predictions:menu",*/
      ],

      /* user: {
         pk: 1,
         firstName: "James",
         lastName: "Dean"
       },*/

      task: {
        annotations: [],
        predictions: [{
          result: resultArrUser
        }],
        // id: 1,
        data: {
          image: this.baseLink + this.xRayData[0]?.xray_image.path
        }

      },

      onLabelStudioLoad: function (LS: { annotationStore: { addAnnotation: (arg0: { userGenerate: boolean; }) => any; selectAnnotation: (arg0: any) => void; }; }) {
        var c = LS.annotationStore.addAnnotation({
          userGenerate: true
        });
        LS.annotationStore.selectAnnotation(c.id);
      },
      onSubmitAnnotation: async function (LS, annotation) {
        // console.log(annotation.serializeAnnotation(), "original");

        return annotation.serializeAnnotation();
      },
      onDeleteAnnotation: async function(LS, annotation) {
        // console.log("delete btn")
        // console.log(annotation.serializeAnnotation())
      },

      onUpdateAnnotation: async function (LS, annotation) {
        this.marker = annotation.serializeAnnotation().map(({ id, original_height, original_width,
          value }) => ({ id, original_height, original_width, value }))
        // console.log(this.marker[0].id)
        // localStorage.setItem('markInfo', ['markInfo']);
        localStorage.setItem('markInfo', JSON.stringify(this.marker))
        // console.log(annotation.serializeAnnotation());

      }


    });

    // console.log(this.labelStudio)
    return this.labelStudio;

  }


  //



/*  save() {

    (<HTMLElement>document.getElementsByClassName('ls-update-btn')[0]).click()
    // console.log(this.labelStudio.onSubmitAnnotation, "***")
    // console.log(this.marker)

  }*/
//   delete() {
//     // console.log("delete function")

//     $('.Entity_button__3c64R .anticon-delete').trigger("click");
//   }

//   saveMarks() {
//     (<HTMLElement>document.getElementsByClassName('ls-update-btn')[0]).click()
//     // console.log(this.labelStudio.onSubmitAnnotation, "***")
//     // console.log(this.marker)

//     // console.log(this.annotations)

//     var markInfo = JSON.parse(localStorage.getItem('markInfo') || '[]');
//     // console.log(markInfo)
//     const markInfo1 = markInfo.filter((elem) => {
//       return this.markData.ai_identified_cavities.rectangle_coordinates.every((ele) => {
//       return elem.id !== ele._id;
//         });
//       });
//       const AiMarks= this.markData.ai_identified_cavities.rectangle_coordinates.filter((elem) => {
//         return markInfo.some((ele) => {
//         return elem._id === ele.id;
//           });
//         });
//  // console.log(markInfo1,AiMarks)
//     const xray_info = {
//       xray_id: this.id,
//       user_id: this.xRayData[0]?.user_id,
//       marker: markInfo1,


//     }
//     const ai_info={
//       xray_id:this.id,
//       ai_cavities:AiMarks
//     }
//     this.userService.updateAIData(ai_info).subscribe((res: any)=>{
//       if(res.success)
//       {
//         // console.log("Ai updated")
//       }
//       else{
//         // console.log("Ai not updated")
//       }
//     })

//         // console.log(xray_info)
//     this.userService.addEvalData(xray_info).subscribe((res: any) => {
//       if (res.success) {
//         Swal.fire({
//           text: res.message,
//           icon: 'success',
//         });
//         document.getElementById('close')?.click();
//       } else {
//         Swal.fire({
//           text: res.message,
//           icon: 'error',
//         });

//       }

//     })
//     localStorage.removeItem('markInfo')
//   }
  renderImage(img: string) {
    if (img) {
      return this.baseLink + img;
    } else {
      return '../assets/images/no-image.jpg';
    }
  }
  handleClick() {
    this.router.navigateByUrl('/uploaded-xray/0');
  }
}
