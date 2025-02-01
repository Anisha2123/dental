import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import LabelStudio from 'label-studio';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxImageZoomModule } from 'ngx-image-zoom';


@Component({
  selector: 'app-mark-xray',
  templateUrl: './mark-xray.component.html',
  styleUrls: ['./mark-xray.component.scss']
})
export class MarkXrayComponent {
  systemAccuracy: any = 0;
  xRayData: any = [];
  id: string;
  markData: any = [];
  userMark: any;
  labelStudio: any;
  AIMarkData: any = [];
  markInfo: any = [];
  totUserCavity: number=0;
  markInfo2: any;
  delCavity: number=0;
  adminMark:number=0;
  avgPer: any=0;
  myThumbnail: string;
  myFullresImage: string;
  evaluationResult: boolean = false;

  constructor(private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private spinner: NgxSpinnerService) {

  }


  // is equal to default value of input range
  valInput: any;
  leftPos: any ;
  marker: any = [];
  baseLink: string = environment.FILE_HOST;
  userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');



  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('xray_id');
    this.spinner.show();
    this.getXray(this.id);
    this.getMark(this.id);
    /*  setTimeout(() => {
        this.createLabelStudio()
      }, 1000);*/
      this.avgPer= ((this.markInfo.length-(this.delCavity+this.adminMark))*100/this.markInfo.length).toFixed(1);

  }
  onRangeChange(event: any) {
    this.valInput = (<HTMLInputElement>event.target).value.trim();
    this.leftPos = `${+(<HTMLInputElement>event.target).value.trim() - 5}%`
    // console.log(this.valInput, this.leftPos)
  }

  getXray(id) {
    this.userService.getXray(id).subscribe((res: any) => {
      if (res.success) {
        this.xRayData = res.getData;
        // console.log(this.xRayData[0]?.xray_image.path)
        this.myThumbnail= this.baseLink + this.xRayData[0]?.xray_image.path;
        this.myFullresImage= this.baseLink + this.xRayData[0]?.xray_image.path;

      }
      else {
        return res.messages;
      }
    })
  }

  handleSwitch(text: any){
    if(text == 'show'){
      this.evaluationResult = false;
      this.getMark(this.id);
    } else if (text == 'hide'){
      this.evaluationResult = true;
    }
   }

  getMark(id) {

    this.userService.getEvalById(id).subscribe((res: any) => {
      if (res.success) {
        this.markData = res.getData;
        // console.log(this.markData)
        this.userMark = this.markData.dentist_correction
        this.AIMarkData = this.markData.ai_identified_cavities;
        this.totUserCavity=this.userMark.length
        // console.log(this.userMark, "***", this.AIMarkData,)
       setTimeout(()=>{
        this.createLabelStudio()
        this.createLabelStudio1()
       },1000)

        setTimeout(() => {
          this.spinner.hide();
        }, 2000);
      }
      else {
        // console.log("error")
      }
    })
  }

  //label-studio

  createLabelStudio() {
    var userMark1 = this.userMark;
    // console.log(this.markInfo, "adminMark")
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

        //"fillColor": "#00ff00",
        "strokewidth":6,
        "strokecolor":"#ff0000",
        "opacity":0.2,

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

    //AI MArking
    const resultArrAI = this.AIMarkData.rectangle_coordinates.map((element: any) => {
      let obj = {
        "from_name": "label",
        "id": element._id,
        "type": "rectanglelabels",
        "source": "$image",
        // "readonly": true,
        // "original_width":this.userMark[1]?.original_height,
        "original_width": "",
        "original_height": "",
        "image_rotation": 0,
        "to_name": "img",

        "fillColor": "#00ff00",
        "background": "red",
        "value":
        {
          "x": element.coordinates[0] * 100.00 / 480,
          "y": element.coordinates[1] * 100.00 / 480,
          "width": (element.coordinates[2] - element.coordinates[0]) * 100.0 / 480,
          "height": (element.coordinates[3] - element.coordinates[1]) * 100.0 / 480,
          "rotation": 0,
          "rectanglelabels": [
            "AI Mark"
          ]
        },
        " readonly": "true"
      }

      // console.log(obj)
      return obj;
      // return element.original_width
    })

    //Admin Marking
    /* const resultArrAdmin = this.markInfo.map((element: any) => {
      let obj = {
        "from_name": "label",
        "id": element.id,
        "type": "rectanglelabels",
        "source": "$image",
       "readonly": false,
        // "original_width":this.userMark[1]?.original_height,
        "original_width": element.original_width,
        "original_height": element.original_height,
        "image_rotation": 0,
        "to_name": "img",

        "fillColor": "#00ff00",
        "background":"green",
        "value":
       {
        "x": element.value.x,
        "y": element.value.y,
        "width": element.value.width,
        "height": element.value.height,
        "rotation": 0,
        "rectanglelabels": [
            "Admin Mark1"
        ]
    }



      }

    // console.log(obj)
      return obj;
      // return element.original_width
    })*/


    const resultArr = resultArrUser.concat(resultArrAI)
    //const resultArr = resultArrAdmin.concat(resultArr1)
    this.labelStudio = new LabelStudio('label-studio',


      {
        config: `
  <View style="display:row; flex-direction: column;">
  <Style> .Controls_wrapper__1Zdbo { display:none; }</Style>
  <Style>.Segment_block__1fyeG {background:transparent !important; border:none; margin-right:0px !important}</Style>
  <Style> .Hint_main__1Svrz { display:none; }</Style>
  <Style>#label-studio .ant-tag {background-color:#02d959 !important;color:white !important; font-weight:bold !important;border:none !important; position: relative;
    top: -7px; padding: 10px 14px; border-radius:4px}</Style>
 <Style> .App_menu__X-A5N{display:none}
 .Entity_row__3Ii1C {display:none}
 .ant-card-small>.ant-card-body{height:20px}</Style>
 <Style> .ls-common</Style>
  <View style="margin-top: -14px;">
 <Style> .ImageView_container__AOBmH img</Style>
 <Image name="img" value="$image" width="100%" height="100%"></Image>
 <Style> canvas { width:100% ; height:100% !important;  }</Style>
 </View>
 <View style="float:right;display:none">
 <RectangleLabels name="label" toName="img" background="green" editable="false" readOnly="true" strokeColor="#000000" canRotate="false" opacity="0.5" strokeWidth="6">
 <Label value="Make Corrections" background="green" strokeColor="#000000"/>
 <Label value="1" background="#FF3131" editable="false"  readOnly="true"/>
 <Label value="2" background="#FFFF00" />
 <Label value="Admin Mark" background="#00008B" />
 <!--<Label value="Admin Mark1" background="#00008B" readOnly="false" />-->
 </RectangleLabels>
 </View>
<View style="flex: 10%;position: absolute;right: 351.5px;
top: -64.5px;">
 <RectangleLabels name="label1" toName="img" background="red" editable="false" readOnly="true" opacity="0.5" strokeWidth="6" strokeColor="#ff0000">
<Label value="Admin Correction" background="#FF7420" opacity="0.3" strokeColor="#ff0000" strokeWidth="8"/>
</RectangleLabels>
 </View>

 </View>
 `,

        interfaces: [
          // "panel",
          "update",
          "submit",
          "controls",
          "side-column",
          //"annotations:menu",
          "annotations:add-new",
          "annotations:delete",
          //"predictions:menu",

        ],

        /* user: {
           pk: 1,
           firstName: "James",
           lastName: "Dean"
         },*/

        task: {

          annotations: [{ result: resultArrUser }
          ],
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
        onDeleteAnnotation: async function (LS, annotation) {
          // console.log("delete btn")
          // console.log(annotation.serializeAnnotation())
        },
        onSubmitAnnotation: async function (LS, annotation) {

          /*this.marker = annotation.serializeAnnotation().map(({ id, original_height, original_width,
            value }) => ({ id, original_height, original_width, value }))
          // console.log(this.marker[0].id)
          // localStorage.setItem('markInfo', ['markInfo']);
          localStorage.setItem('markInfo', JSON.stringify(this.marker));*/

          // console.log(annotation.serializeAnnotation());

          return annotation.serializeAnnotation();

        },
        onUpdateAnnotation: async function (LS, annotation) {
          this.marker = annotation.serializeAnnotation().map(({ id, original_height, original_width,
            value }) => ({ id, original_height, original_width, value }))
          // console.log(this.marker[0].id)
          // localStorage.setItem('markInfo', ['markInfo']);
          localStorage.setItem('markInfo', JSON.stringify(this.marker));
          // console.log(annotation.serializeAnnotation(), "update");

        },


      });


    return this.labelStudio;

  }

  /*onLabelStudioEvent(event: any) {

    if (event.type === 'onEntityCreate') {
      const selectedAnnotationId = this.labelStudio.ls.annotations[this.labelStudio.ls.annotations.length - 1].id;
      // console.log('Selected annotation ID:', selectedAnnotationId);
    }
  }*/


  //
  createLabelStudio1() {
    const labelStudio = new LabelStudio('label-studio1', {
      config: `
  <View style="display:row; flex-direction: column;">
  <Style> .Controls_wrapper__1Zdbo { display:none; }</Style>
  <Style>.Segment_block__1fyeG {background:transparent !important; border:none; margin-right:0px !important}</Style>
  <Style> .Hint_main__1Svrz { display:none; }</Style>
  <Style>.ant-tag {background-color:#02d959 !important; color:white !important; font-weight:bold !important;border:none !important}
  .ImageView_block__3BAO- {margin-left:-49px}
  </Style>
 <View style="margin-top: -14px;">
 <Style> .ImageView_container__AOBmH img</Style>

 <Image name="img" value="$image" width="100%" height="100%" zoom="true" zoomControl="true" ></Image>
 <Style> canvas { width:100%; height:100% !important }</Style>
 </View>
 <View style="flex: 10%;float:right">
 <RectangleLabels name="tag" toName="img">
 <!-- <Label value="Add Mark" background="#00008B"></Label>
<Label value="Add Mark1" style=""></Label>-->

 </RectangleLabels>
 </View>

 </View>
 `,

      interfaces: [
        // "panel",
        // "update",
        //"submit",
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

        return annotation.serializeAnnotation();
      },
      onUpdateAnnotation: async function (LS, annotation) {
        // console.log(annotation.serializeAnnotation());

      }


    });

    // console.log(labelStudio)
    return labelStudio;

  }



  delete() {
    // console.log("delete function")

    $('.Entity_button__3c64R .anticon-delete').trigger("click");
  }


  save() {
    // console.log("submit");

    var parent = document.getElementById('label-studio');
    (<HTMLElement>parent.getElementsByClassName('ls-update-btn')[0]).click()
    // (<HTMLElement>document.getElementsByClassName('ls-submit-btn')[0]).click()
    // console.log(this.labelStudio.onSubmitAnnotation, "***")
    // console.log(this.marker)

    this.markInfo = JSON.parse(localStorage.getItem('markInfo') || '[]');
    // console.log(this.markInfo)
    // console.log(this.userMark)

    //for cavity label
    const markInfo3 = this.markInfo.filter((elem) => {
      return this.userMark.some((ele) => {
        return elem.id === ele.id;
      });
    });
    const markInfo4 = this.markInfo.filter((elem) => {
      return this.AIMarkData.rectangle_coordinates.some((ele) => {
        return elem.id === ele._id;
      });
    });
   // console.log(markInfo3.length ,this.userMark.length,markInfo4.length,"remain")
    // const delCavity1= markInfo3.length+markInfo4.length
    const delCavity1 =this.userMark.length-markInfo3.length
    //end for cavity label

    const markInfo1 = this.markInfo.filter((elem) => {
      return this.userMark.every((ele) => {
        return elem.id !== ele.id;
      });
    });
    this.markInfo2 = markInfo1.filter((elem) => {
      return this.AIMarkData.rectangle_coordinates.every((ele) => {
        return elem.id !== ele._id;
      });
    });

    //this.delCavity=this.totUserCavity - delCavity1
    this.delCavity=delCavity1
    this.adminMark=this.markInfo2.length;
    // console.log(this.markInfo2, "new data")
    this.avgPer= ((this.markInfo.length-(this.delCavity+this.adminMark))*100/this.markInfo.length).toFixed(1);
    // console.log("avgPer",this.avgPer)
    this.valInput= this.avgPer;
    this.leftPos = this.avgPer;
  }

  saveMarks() {
    // const newArr = this.AIMarkData._id.concat(this.userMark.id)
    //// console.log(newArr,"new")
    /*  this.markInfo = JSON.parse(localStorage.getItem('markInfo') || '[]');
    // console.log(this.markInfo)
    // console.log(this.userMark)

    //for cavity label
    const markInfo3 = this.markInfo.filter((elem) => {
      return this.userMark.some((ele) => {
        return elem.id === ele.id;
      });
    });
    const markInfo4 = this.markInfo.filter((elem) => {
      return this.AIMarkData.rectangle_coordinates.some((ele) => {
        return elem.id === ele._id;
      });
    });
   // console.log(markInfo3.length ,markInfo4.length,"remain")
    //end for cavity label

    const markInfo1 = this.markInfo.filter((elem) => {
      return this.userMark.every((ele) => {
        return elem.id !== ele.id;
      });
    });
    this.markInfo2 = markInfo1.filter((elem) => {
      return this.AIMarkData.rectangle_coordinates.every((ele) => {
        return elem.id !== ele._id;
      });
    });

    // console.log(this.markInfo2, "new data")*/

    const xray_info = {
      xray_id: this.id,
      user_id: this.xRayData[0]?.user_id,
      marker: this.markInfo,
      accuracy_per: this.valInput,
      accurate_val: (this.markInfo.length-(this.delCavity+this.adminMark))

    }
    // console.log(xray_info)
    this.userService.addEvalDataFromAdmin(xray_info).subscribe((res: any) => {
      if (res.success) {
        Swal.fire({
          text: res.message,
          //icon: 'success',
          imageUrl: '../../../../assets/images/success.png',
        });
       // this.createLabelStudio()
       document.getElementById('close')?.click();
        // this.router.navigateByUrl('/uploaded-xray/0');
        window.location.href="/uploaded-xray/0"
        return true;
      } else {
        Swal.fire({
          text: res.message,
          icon: 'error',
        });

      }

    })
  }
  renderImage(img: string) {
    if (img) {
      return this.baseLink + img;
    } else {
      return '../assets/images/edit.png';
    }
  }
  handleClick() {
    this.router.navigateByUrl('/uploaded-xray/0');
  }
  flag(){
    const flagData={
      id: this.xRayData[0]?.user_id,
      flag: 1,
    }
    this.userService.setFlag(flagData).subscribe((res:any)=>{
      if (res.success){
        // console.log("flag set successfully")
      }
      else{
        // console.log("flag not set successfully")
      }
    })
    this.router.navigateByUrl('/uploaded-xray');
  }
  change(e){
    this.avgPer= ((this.markInfo.length-(this.delCavity+this.adminMark))*100/this.markInfo.length).toFixed(1);
    this.valInput= this.avgPer;
    // console.log("***",this.avgPer)
  }
}
