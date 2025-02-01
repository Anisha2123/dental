import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import LabelStudio from 'label-studio';
import { event } from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgxImageZoomModule } from 'ngx-image-zoom';
import { AppService } from '../../../services/app.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-evaluate-xray',
  templateUrl: './evaluate-xray.component.html',
  styleUrls: ['./evaluate-xray.component.scss']
})
export class EvaluateXrayComponent {
  title = 'ARTI - Evaluate X-Ray';
  markData: any;
  myThumbnail: any;
  myFullresImage: any;
  evaluationResult: boolean = true;
  // is equal to default value of input range
  constructor(private route: ActivatedRoute,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private appService: AppService,
    private sanitizer: DomSanitizer,
    private titleService: Title,) {
      titleService.setTitle(this.title);
  }
  public xray: any;
  public imgName: any;
  valInput = '25';
  leftPos = `25%`;
  marker: any;
  xRayData: any = [];
  userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
  patient_ID = localStorage.getItem('patient_ID')
  baseLink: string = environment.FILE_HOST;
  id: any;
  labelStudio: any;
  marks_array: any = [];
  annotations: any;
  totalAI: number = 0;
  cavity: any;
  public file: any;
  public idUser: any;
  public urlOfImg: any;
  public msg: any;
  public clientHeight: any;
  public forTesting: boolean = true;
  public initAIResp: any;
  public pageRefresh: boolean = true;
  onRangeChange(event: any) {
    this.valInput = (<HTMLInputElement>event.target).value.trim();
    this.leftPos = `${+(<HTMLInputElement>event.target).value.trim() - 5}%`
  }


  ngOnInit() {
    console.log(this.patient_ID)
    // this.id = this.route.snapshot.paramMap.get('xray_id');
    // console.log(this.router.url.split('/')[1])
    // console.log(this.route.snapshot.url[0].path)
    // this.appService.updateGetUrl(this.route.snapshot.url[0].path)
    this.appService.currentApprovalStageImage.subscribe((img: any) => {
      // console.log(img)
      this.file = img.file
      this.idUser = img.id
      setTimeout(() => {
        // localStorage.setItem("file", JSON.stringify(img.file));
      }, 1000)
    })

    // this.getXray("646331c17e506d72d6a46de6");

    this.cavity = document.getElementById("cavity")
    this.cavity.style.display = "none";

    this.displayImg()
    this.getPhoto()
    // setTimeout(() => {
    // // console.log(this.myThumbnail)
    //  this.createLabelStudio()
    //  }, 3000);
    //this.createLabelStudio();
    this.idUser = this.idUser ? this.idUser : this.userInfo.id
  }
  getPhoto() {
    var base64 = localStorage["file"];
    var base64Parts = base64.split(",");
    var fileFormat = base64Parts[0].split(";")[1];
    var fileContent = base64Parts[1];
    var file = new File([fileContent], "file name here", {type: fileFormat});
    // console.log(file)
    return file;
 }
 handleSwitch(text: any){
  if(text == 'show'){
    this.evaluationResult = false;
    this.displayImg();
  } else if (text == 'hide'){
    this.evaluationResult = true;
  }
 }
  getXray(id) {

    this.userService.getXray(id).subscribe((res: any) => {
      // console.log(res)
      if (res.success) {
        this.xRayData = res.getData;
        // console.log(this.xRayData[0]?.xray_image, res)
        // console.log(this.xRayData[0]?.xray_image.path.split('/')[1])
        this.imgName = res.getData[0]?.xray_image?.path.split('/')[1]
        //  fetch(this.xRayData[0]?.xray_image.path)
        //   .then(result => // console.log(result.url))
        //// console.log(a)
        // this.myThumbnail = this.baseLink + this.xRayData[0]?.xray_image.path;
        // // console.log(document.getElementsByClassName("ngxImageZoomContainer")[0].attributes)
        // // console.log(document.getElementsByClassName("ngxImageZoomContainer")[0])
        // console.log(document.getElementsByClassName("ngxImageZoomContainer")[0].clientHeight)
        this.clientHeight = document.getElementsByClassName("ngxImageZoomContainer")[0].clientHeight
        this.myFullresImage = this.baseLink + this.xRayData[0]?.xray_image.path;
        this.defaultApi(this.xRayData[0]?.xray_image.path, this.xRayData[0]?.xray_image.mimetype)
        this.createLabelStudio1()
        // console.log(this.myFullresImage)
      }
      else {
        return res.messages;
      }
    })
  }

  displayImg() {
    // console.log(this.file, this.idUser, this.file?.name, this.file?.type)
    // // console.log(JSON.parse(localStorage.getItem('file')))
    if (this.file) {
      var reader = new FileReader();
      // // console.log(JSON.parse(localStorage.getItem('file')));
      reader.readAsDataURL(this.file);
      reader.onload = (_event) => {
        this.msg = "";
        this.myThumbnail = reader.result;
        this.myFullresImage = reader.result;
        localStorage.setItem('filepath', JSON.stringify(reader.result))
      }
      let formdata = new FormData();
      formdata.append('file', this.file)
      // setTimeout(() => {
      //   // console.log(formdata)
      //   localStorage.setItem('file', JSON.stringify(formdata));
      // }, 1000)
      this.userService.generateAIData(formdata).subscribe((res: any) => {
        // console.log(res, res.final_image_path.split('/')[2].slice(17))
        this.initAIResp = res.data;
        this.createLabelStudio2()
        this.forTesting = false
      })
      this.retrievingFile();
    } else {
      this.appService.updateGetUrl(true);
      // console.log(JSON.parse(localStorage.getItem('filepath')));
      this.myThumbnail = JSON.parse(localStorage.getItem('filepath'));
      this.myFullresImage = JSON.parse(localStorage.getItem('filepath'));
      this.createLabelStudio3();
      this.forTesting = false;
      // // console.log(localStorage.getItem('file'));
      // this.file = localStorage.getItem('file');
      // var reader = new FileReader();
      // reader.readAsDataURL(this.file);
      // reader.onload = (_event) => {
      //   this.msg = "";
      //   this.myThumbnail = reader.result;
      //   this.myFullresImage = reader.result;
      // }
      // var formdata = new FormData();
      // formdata.append('file', this.file)
      // this.userService.generateAIData(formdata).subscribe((res: any) => {
      //   // console.log(res, res.final_image_path.split('/')[2].slice(17))
      //   this.initAIResp = res;
      //   this.createLabelStudio2()
      //   this.forTesting = false
      // })
      // this.pageRefresh = false;
      // // console.log(this.pageRefresh, "REFRESHED")
      // Swal.fire({
      //   title: 'Page Refreshed',
      //   text: "Your progress is lost, please try again.",
      //   icon: 'warning',
      //   showCancelButton: false,
      //   confirmButtonColor: '#3085d6',
      //   // cancelButtonColor: '#d33',
      //   confirmButtonText: 'Ok',
      // }).then((result) => {
      //   if (result.isConfirmed) {
      //     this.router.navigateByUrl('/dashboard');
      //   } else {
      //     this.router.navigateByUrl('/dashboard');
      //   }
      // });
    }
    // setTimeout(() => {
    //   // console.log(this.myThumbnail)
    // }, 3000);

    var myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer my-secret-auth-token");
    myHeaders.append('Access-Control-Allow-Origin', "*");
    myHeaders.append('Access-Control-Allow-Headers', "*");
    myHeaders.append('Access-Control-Allow-Origin', 'http://localhost:4200');

    // fetch("https://c602-52-173-187-78.ngrok-free.app/predict", {
    //   method: 'POST',
    //   headers: myHeaders,
    //   body: formdata,
    //   redirect: 'follow'
    // }).then((res: any) => {
    //   // console.log(res)
    // }).catch((err) => {
    //   // console.log(err)
    // })

  }

  retrievingFile(){
    // console.log(JSON.parse(localStorage.getItem('filepath')))
    let base64 = JSON.parse(localStorage.getItem('filepath'))
    var base64Parts = base64.split(",");
    var fileFormat = base64Parts[0].split(";")[1];
    var fileContent = base64Parts[1];
    var file = new File([fileContent], "file name here", {type: fileFormat});
    // console.log(file)
    // return file;
  }

  createLabelStudio2() {
    // console.log(true, "THIS IS THIRD TRUE");
    // console.log(this.initAIResp)
    this.evaluationResult = false;
    localStorage.setItem('labels', JSON.stringify(this.initAIResp))
    this.forTesting = true;
    let boxes = []
    for (let coords of this.initAIResp.boxes) {
      boxes.push({
        coordinates: coords
      })
    }
    this.initAIResp.boxes = boxes;
    const resultArr = this.initAIResp.boxes.map((element: any, index: any) => {
      let obj = {
        "from_name": "label",
        "id": index,
        "type": "rectanglelabels",
        "source": "$image",

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
            this.initAIResp.labels[index].toString()
          ]
        }
      }
      // console.log((element.coordinates[2] - element.coordinates[0]) * 100.0 / 480)
      // console.log((element.coordinates[3] - element.coordinates[1]) * 100.0 / 480)

      // console.log(obj)
      return obj;
      // return element.original_width
    })
    this.labelStudio = new LabelStudio('label-studio', {
      config: `
      <View style="display:row; flex-direction: column;">
      <Style> .Controls_wrapper__1Zdbo { display:none; }</Style>
      <Style>.Segment_block__1fyeG {background:transparent !important; border:none; margin-right:0px !important}</Style>
      <Style> .Hint_main__1Svrz { display:none; }</Style>
      <Style>#label-studio .ant-tag {background-color:#02d959 !important;color:white !important; font-weight:bold !important;border:none !important; position: relative;
        top: 0px; padding: 13px 14px; border-radius:4px;}</Style>
     <Style> .App_menu__X-A5N{display:none}
     .Entities_treelabels__1eXl8{height:20px;overflow-y:hidden}
     .Entity_row__3Ii1C {display:none}</Style>
     <Style> .ls-common</Style>
      <View style="margin-top: -14px;">
     <Style> .ImageView_container__AOBmH img</Style>
     <Image name="img" value="$image" width="100%" height="100%"></Image>
     <Style> canvas { width:100% ; height:100% !important;  }</Style>
     </View>
      <View style="float:right;display:none">
      <RectangleLabels name="label" toName="img" background="red" opacity="0.5" strokeWidth="6">
      <Label value="1" background="#FF3131" />
      <Label value="2" background="#FFFF00" />
      </RectangleLabels>

      </View>
      <View style="flex: 10%;position: absolute;right: 688.5px;
      top: -82px;" >
      <RectangleLabels name="label1" toName="img" background="red" opacity="0.5" strokeWidth="8">
      <Label value="Make Corrections" background="green" title="Click on edit to start marking X-Ray"/>
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
        annotations: [{
          result: resultArr
        }],
        predictions: [],
        // id: 1,
        data: {
          image: this.myThumbnail
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
      onDeleteAnnotation: async function (LS, annotation) {
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

  createLabelStudio3() {
    this.evaluationResult = false;
    // console.log(true, "THIS IS FOURTH TRUE");
    this.initAIResp = JSON.parse(localStorage.getItem('labels'));
    // console.log(this.initAIResp)
    // localStorage.setItem('labels', JSON.stringify(this.initAIResp))
    this.forTesting = false;
    let boxes = []
    for (let coords of this.initAIResp.boxes) {
      boxes.push({
        coordinates: coords
      })
    }
    this.initAIResp.boxes = boxes;
    const resultArr = this.initAIResp.boxes.map((element: any, index: any) => {
      let obj = {
        "from_name": "label",
        "id": index,
        "type": "rectanglelabels",
        "source": "$image",

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
            this.initAIResp.labels[index].toString()
          ]
        }
      }
      // console.log((element.coordinates[2] - element.coordinates[0]) * 100.0 / 480)
      // console.log((element.coordinates[3] - element.coordinates[1]) * 100.0 / 480)

      // console.log(obj)
      return obj;
      // return element.original_width
    })
    this.labelStudio = new LabelStudio('label-studio', {
      config: `
      <View style="display:row; flex-direction: column;">
      <Style> .Controls_wrapper__1Zdbo { display:none; }</Style>
      <Style>.Segment_block__1fyeG {background:transparent !important; border:none; margin-right:0px !important}</Style>
      <Style> .Hint_main__1Svrz { display:none; }</Style>
      <Style>#label-studio .ant-tag {background-color:#02d959 !important;color:white !important; font-weight:bold !important;border:none !important; position: relative;
        top: 0px; padding: 13px 14px; border-radius:4px; font-size: 14px !important}</Style>
     <Style> .App_menu__X-A5N{display:none}
     .Entities_treelabels__1eXl8{height:20px;overflow-y:hidden}
     .Entity_row__3Ii1C {display:none}</Style>
     <Style> .ls-common </Style>
      <View style="margin-top: -14px; display: block;">
     <Style> .ImageView_container__AOBmH img</Style>
     <Image name="img" value="$image" width="100%" height="100%"></Image>
     <Style> canvas { width:100% ; height:100% !important;  }</Style>
     </View>
      <View style="float:right;display:none">
      <RectangleLabels name="label" toName="img" background="red" opacity="0.5" strokeWidth="6">
      <Label value="1" background="#FF3131" />
      <Label value="2" background="#FFFF00" />
      </RectangleLabels>

      </View>
      <View style="flex: 10%;position: absolute;right: 688.5px;
      top: -82px;">
      <RectangleLabels name="label1" toName="img" background="red" opacity="0.5" strokeWidth="8">
      <Label value="Make Corrections" background="green" title="Click on edit to start marking X-Ray"/>
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
        annotations: [{
          result: resultArr
        }],
        predictions: [],
        // id: 1,
        data: {
          image: this.myThumbnail
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
      onDeleteAnnotation: async function (LS, annotation) {
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
    this.forTesting = false;
    // console.log(this.labelStudio)
    return this.labelStudio;
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

  async defaultApi(path, type) {
    // * this.spinner.show();
    this.userService.getEvalById(this.id).subscribe((res: any) => {
      // console.log(res)
      this.xray = res?.getData?.xray_id
      if (!res.success) {
        // console.log("false")
        const image_data = {
          img_path: path,
          img_type: type,
          xray_id: this.id
        }
        this.userService.loadAIData(image_data).subscribe((res: any) => {
          // console.log("api", res, image_data)
          if (res.success) {

            // console.log("API called succefully", res.getData)
            setTimeout(() => {
              this.getMarks()
              // * this.spinner.hide();
              this.forTesting = false
            }, 2000)
          }
          else {
            // * this.spinner.hide();
            this.forTesting = false
            // console.log("not called", res)
          }
        })

      }
      else {
        if (res.success) {
          this.markData = res.getData;
          setTimeout(() => {
            // * this.spinner.hide();
            this.forTesting = false
          }, 2000)
          // // console.log(this.markData.ai_identified_cavities.rectangle_coordinates[0].coordinates[1], "record found")
          this.totalAI = this.markData.ai_identified_cavities.rectangle_coordinates.length;
          this.cavity.style.display = "block";
          var obj = this.markData.ai_identified_cavities
          const entries = Object.entries(obj);
          const resultArr = this.markData.ai_identified_cavities.rectangle_coordinates.map((element: any, index: any) => {
            // console.log(this.markData.ai_identified_cavities.color_labels[index], "/**/")
          })
          // console.log(entries, "new obj")
          this.createLabelStudio()
          this.forTesting = false
        }
      }
    })


  }

  getMarks() {
    this.userService.getEvalById(this.id).subscribe((res: any) => {
      // console.log(res)
      if (res.success) {
        this.markData = res.getData;
        // console.log(this.markData.ai_identified_cavities.rectangle_coordinates[0].coordinates[2])
        //this.userMark = this.markData.dentist_correction
        //// console.log(this.userMark, "***")
        var obj = this.markData.ai_identified_cavities
        const entries = Object.keys(obj).map((key) => [
          key,
          obj[key],
        ]);
        const resultArr = this.markData.ai_identified_cavities.rectangle_coordinates.map((element: any, index: any) => {
          // console.log(this.markData.ai_identified_cavities.color_labels[index], "/**/")
        })
        // console.log(entries, "new obj")
        this.totalAI = this.markData.ai_identified_cavities.rectangle_coordinates.length
        this.cavity.style.display = "block";
        this.createLabelStudio()
        this.forTesting = false
      }
      else {
        // console.log("error")
      }
    })
  }

  //label-studio
  createLabelStudio1() {
    this.forTesting = true;


    // console.log(true, "THIS IS FIRST TRUE");
    this.labelStudio = new LabelStudio('label-studio1',


      {
        config: `
        <View style="display:row; flex-direction: column;">
        <Style> .Controls_wrapper__1Zdbo { display:none; }</Style>
        <Style>.Segment_block__1fyeG {background:transparent !important; border:none; margin-right:0px !important}</Style>
        <Style> .Hint_main__1Svrz { display:none; }</Style>
        <Style>.ant-tag {background-color:#02d959 !important; color:white !important; font-weight:bold !important;border:none !important}</Style>
       <View style="flex: 90%;
       margin-top: -14px;">
       <Style> .ImageView_container__AOBmH img {  height:354px !important }
       .ImageView_block__3BAO- {margin-left:-49px}</Style>
       <Image name="img" value="$image" width="100%" height="100%" ></Image>
       <Style> canvas { width:594px; height:354px !important }</Style>
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
            image: this.file
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

    // console.log(true, "THIS IS SECOND TRUE", this.labelStudio);


    return this.labelStudio;

  }

  createLabelStudio() {
    // console.log(true, "THIS IS THIRD TRUE");
    this.forTesting = true;
    const resultArr = this.markData.ai_identified_cavities.rectangle_coordinates.map((element: any, index: any) => {
      let obj = {
        "from_name": "label",
        "id": element._id,
        "type": "rectanglelabels",
        "source": "$image",

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
            this.markData.ai_identified_cavities.color_labels[index].toString()
          ]
        }
      }

      // console.log(obj)
      return obj;
      // return element.original_width
    })
    this.labelStudio = new LabelStudio('label-studio', {
      config: `
      <View style="display:row; flex-direction: column;">
      <Style> .Controls_wrapper__1Zdbo { display:none; }</Style>
      <Style>.Segment_block__1fyeG {background:transparent !important; border:none; margin-right:0px !important}</Style>
      <Style> .Hint_main__1Svrz { display:none; }</Style>
      <Style>#label-studio .ant-tag {background-color:#02d959 !important;color:white !important; font-weight:bold !important;border:none !important; position: relative;
        top: 0px; padding: 13px 14px; border-radius:4px}</Style>
     <Style> .App_menu__X-A5N{visibility:hidden}
     .Entities_treelabels__1eXl8{height:20px;overflow-y:hidden}
     .Entity_row__3Ii1C {display:none}</Style>
     <Style> .ls-common {height:354px !important}</Style>
      <View style="flex: 90%;
     margin-top: -14px; width:566px">
     <Style> .ImageView_container__AOBmH img {  height:354px !important; width:566px }</Style>
     <Image name="img" value="$image" width="100%" height="100%"></Image>
     <Style> canvas { width:566px ; height:354px !important;  }</Style>
     </View>
      <View style="float:right;visibility:hidden">
      <RectangleLabels name="label" toName="img" background="red" opacity="0.5" strokeWidth="6">
      <Label value="1" background="#FF3131" />
      <Label value="2" background="#FFFF00" />
      </RectangleLabels>

      </View>
      <View style="flex: 10%;position: absolute;left: -35%;
      margin-top: 78px;">
      <RectangleLabels name="label1" toName="img" background="red" opacity="0.5" strokeWidth="8">
      <Label value="Edit" background="green" />
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
        annotations: [{
          result: resultArr
        }],
        predictions: [],
        // id: 1,
        data: {
          image: this.file
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
      onDeleteAnnotation: async function (LS, annotation) {
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
  zoom(e) {
    // console.log("zoom function")

    $('.ImageView_block__3BAO- .anticon-zoom-in').trigger("click");
    $('.ImageView_block__3BAO- .anticon-drag').trigger("click");
  }
  zoomOut(e) {
    // console.log("zoom out function")

    $('.ImageView_block__3BAO- .anticon-zoom-out').trigger("click");
  }

  /*  save() {

      (<HTMLElement>document.getElementsByClassName('ls-update-btn')[0]).click()
      // console.log(this.labelStudio.onSubmitAnnotation, "***")
      // console.log(this.marker)

    }*/
  delete() {
    // console.log("delete function")

    $('.Entity_button__3c64R .anticon-delete').trigger("click");
  }

  saveMarks() {
    Swal.fire({
      title: 'Are you sure?',
      text: "Once you commit, you won't be able to edit.",
      //icon: 'warning',
      imageUrl: '../../../../assets/images/warning.png',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 3c-4.625 0-8.442 3.507-8.941 8.001H10v-3l5 4-5 4v-3H3.06C3.56 17.494 7.376 21 12 21c4.963 0 9-4.037 9-9s-4.037-9-9-9z"></path></svg>',
    }).then((result) => {
      if (result.isConfirmed) {
        // this.router.navigateByUrl('/upload-xray/0');
        this.appService.updateApprovalMessage(false);
        this.appService.updateGetUrl(false);
        (<HTMLElement>document.getElementsByClassName('ls-update-btn')[0]).click()
        // console.log(this.labelStudio.onSubmitAnnotation, "***")
        // console.log(this.marker)

        // console.log(this.annotations)

        var markInfo = JSON.parse(localStorage.getItem('markInfo') || '[]');
        // console.log(markInfo)
        const markInfo1 = markInfo.filter((elem) => {
          return this.initAIResp.boxes.every((ele) => {
            return elem.id !== ele._id;
          });
        });
        const AiMarks = this.initAIResp.boxes.filter((elem) => {
          return markInfo.some((ele) => {
            return elem._id === ele.id;
          });
        });
        // console.log(markInfo1, AiMarks)
        const xray_info: any = {
          // xray_id: this.id,
          user_id: this.idUser ? this.idUser : this.userInfo.id,
          marker: markInfo,
          total_cavities: markInfo.length
        }
        // console.log(xray_info, this.file, this.idUser, this.initAIResp)
        const { boxes, final_cnt_cavities, final_cnt_detections, final_cnt_probable_cavities, final_image_path, image_name, labels, primary_model_cnt_detections, primary_model_image_path, scores, secondary_model_cnt_detections, secondary_model_image_path, tags } = this.initAIResp
        let ai_data = {
          rectangle_coordinates: boxes,
          color_labels: labels,
          accuracy_score: scores,
          primary_model_cnt_detections: primary_model_cnt_detections,
          primary_model_image_path: primary_model_image_path,
          secondary_model_cnt_detections: secondary_model_cnt_detections,
          secondary_model_image_path: secondary_model_image_path,
          tags: tags,
          image_name: image_name,
          final_image_path: final_image_path,
          final_cnt_detections: final_cnt_detections,
          final_cnt_cavities: final_cnt_cavities,
          final_cnt_probable_cavities: final_cnt_probable_cavities,
        }
        let formData = new FormData();
        formData.append('xray_image', this.file);
        formData.append('user_id', this.idUser);
        formData.append('patient_id', this.patient_ID ? this.patient_ID: '' )
        formData.append('ai_data', JSON.stringify(ai_data));
        formData.append('xray_data', JSON.stringify(xray_info));
        // return // console.log(this.file, this.idUser, ai_data, xray_info);
        this.userService.sendXrayData(formData).subscribe((res: any) => {
          // console.log(res)
          if (res.success) {
            Swal.fire({
              text: "X-Ray evaluated successfully.",
              icon: 'success',
            });
            // this.router.navigateByUrl('/upload-xray/0')
            window.location.href="/upload-xray/0"
          } else {
            Swal.fire({
              title: 'Error Occurred',
              text: "Your progress is lost, please try again.",
              icon: 'error',
              showCancelButton: false,
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Ok',
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigateByUrl('/upload-xray/0');
              } else {
                this.router.navigateByUrl('/dashboard');
              }
            });
          }
        })
        localStorage.removeItem('markInfo')
      }
    });
    // const ai_info={
    //   xray_id:this.id,
    //   ai_cavities:AiMarks
    // }
    // this.userService.updateAIData(ai_info).subscribe((res: any)=>{
    //   if(res.success)
    //   {
    //     // console.log("Ai updated")
    //   }
    //   else{
    //     // console.log("Ai not updated")
    //   }
    // })


    // this.userService.addEvalData(xray_info).subscribe((res: any) => {
    //   if (res.success) {
    //     Swal.fire({
    //       text: res.message,
    //       icon: 'success',
    //     });
    //     document.getElementById('close')?.click();
    //     this.router.navigateByUrl('/upload-xray/0');
    //   } else {
    //     Swal.fire({
    //       text: res.message,
    //       icon: 'error',
    //     });

    //   }

    // })
  }
  renderImage(img: string) {
    if (img) {
      return this.baseLink + img;
    } else {
      return '../assets/images/no-image.jpg';
    }
  }
  handleClick(e: any) {
    // // console.log(id, name)
    Swal.fire({
      title: 'Are you sure?',
      text: "Your progress will be lost!",
      //icon: 'warning',
      imageUrl: '../../../../assets/images/warning.png',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 3c-4.625 0-8.442 3.507-8.941 8.001H10v-3l5 4-5 4v-3H3.06C3.56 17.494 7.376 21 12 21c4.963 0 9-4.037 9-9s-4.037-9-9-9z"></path></svg>',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          title: 'Success!',
          text: 'You Have Discarded The Image Successfully',
          icon: 'success',
        });
        if(e == 'dashboard'){
          this.appService.updateGetUrl(false)
          this.router.navigateByUrl('/dashboard');
        } else if (e == '/upload-xray/0') {
          this.appService.updateGetUrl(false)
          this.router.navigateByUrl('/upload-xray/0');
        } else if (e == 'logout') {
          this.appService.updateGetUrl(false)
          this.appService.logout()
        }
        // this.userService.deleteXrayByID(id, { name: name }).subscribe((res: any) => {
        //   // console.log(res)
        //   if (res.success) {
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
  refresh() {
    this.forTesting = false;
    // window.location.reload();
    // console.log(JSON.parse(localStorage.getItem('labels')))
    this.createLabelStudio3()
  }
}

/*
 "result":this.userMark.map((element:any) => { [
          {
              "from_name": "tag",
              "id": "Dx_aB91ISN",

              "source": "$image",
              // "original_width":this.userMark[1]?.original_height,
              "original_width":element?.original_width,
               "original_height": element?.original_height,
              "image_rotation": 0,
              "to_name": "img",
              "type": "ellipselabels",
              "value": {

                "height": 10.458911419423693,
                "ellipselabels": [
                  "Add Mark"
                ],
               "radiusX":element?.value.radiusX,
               "radiusY":element?.value.radiusY,
                "rotation": 0,

                "x":element?.value.x,
                "y":element?.value.y
              }
          }
      ]}),
 */
