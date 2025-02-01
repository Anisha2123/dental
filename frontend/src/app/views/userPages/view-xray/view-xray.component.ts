import { Component, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import LabelStudio from 'label-studio';
import { event } from 'jquery';
import { NgxSpinnerService } from 'ngx-spinner';
import { Title } from '@angular/platform-browser';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import 'jspdf-autotable';
import { DatePipe } from '@angular/common';



@Component({
  selector: 'app-view-xray',
  templateUrl: './view-xray.component.html',
  styleUrls: ['./view-xray.component.scss']
})
export class ViewXrayComponent {



  evaluationResult: boolean = false;

  markData: any = [];
  userMark: any = [];
  AIMarkData: any;
  title = 'ARTI - View X-Ray';
  first_name: any;
  last_name: any;
  contact_number: any;
  DOB: any;
  patient_id: any;
  xRayImg: any;
  EvaluatedImagebase64: string;
  Imagebase64: string;
  evaluated_Date: any;
  email: any;
  formattedEvaluatedDate: string;
  userRecord: any;
  
  constructor(private route: ActivatedRoute,
    private userService: UserService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private titleService: Title,) {
    titleService.setTitle(this.title);
    
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
  totalAI: number = 0;
  cavity: any;



  onRangeChange(event: any) {
    this.valInput = (<HTMLInputElement>event.target).value.trim();
    this.leftPos = `${+(<HTMLInputElement>event.target).value.trim() - 5}%`
  }

  ngOnInit() {

    this.id = this.route.snapshot.paramMap.get('xray_id');
    this.spinner.show();
    setTimeout(() => {
    this.getXray(this.id);
    this.getMark(this.id);
    }, 2000);
    
    //this.evaluated_Date = '2024-07-18T08:05:03.774Z';
    //console.log(this.evaluated_Date,"<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
    //this.formatEvaluatedDate();
    /* setTimeout(() => {

       this.createLabelStudio()
     }, 1000);*/
    //this.createLabelStudio();
  }

  ngAfterViewInit(): void {
    console.log('After page load');

    this.userRecord = JSON.parse(localStorage.getItem('userRecord'))
    console.log(this.userRecord);
    
    
  }


  getXray(id) {
    this.spinner.show()
    this.userService.getXray(id).subscribe((res: any) => {
      //.log(res)
      if (res.success) {
        this.xRayData = res.getData;
        this.xRayImg = res.getData[0].base64String
        this.createLabelStudio1()
        this.spinner.hide()
      }
      else {
        return res.messages;
      }
    })
  }
  handleSwitch(text: any) {
    if (text == 'show') {
      this.evaluationResult = false;
      // this.displayImg();
      this.getMark(this.id);
    } else if (text == 'hide') {
      this.evaluationResult = true;
    }
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
      console.log(res)
      if (res.success) {
        console.log(this.markData,">>>>>>>>>>>>>>>>>>>>>>>");
        this.markData = res.getData;
        this.markData.evaluated_patient.created_at
        
        this.first_name = this.markData?.evaluated_patient?.first_name
        this.last_name = this.markData?.evaluated_patient?.last_name
        this.contact_number = this.markData?.evaluated_patient?.contact_number
        this.DOB = this.markData?.evaluated_patient?.DOB
        this.patient_id = this.markData?.evaluated_patient?.patient_unique_id
        this.email = this.markData?.evaluated_patient?.email
        
        // console.log(this.markData)

        const date = new Date( this.markData?.evaluated_patient?.created_at);
    
        const formattedDate = `${this.padDate(date.getMonth() + 1)}/${this.padDate(date.getDate())}/${date.getFullYear()}`;
        console.log(formattedDate)
        this.evaluated_Date = formattedDate;
        this.userMark = this.markData.dentist_correction
        // this.AIMarkData = this.markData.ai_identified_cavities;
        // console.log(this.userMark, "***", this.AIMarkData)
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
  padDate(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
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

  createLabelStudio() {
    const resultArrUser = this.userMark.map((element: any) => {
      return {
        "from_name": "label",
        "id": element.id,
        "type": "rectanglelabels",
        "source": "$image",
        "readonly": false,
        "canrotate": false,
        "original_width": element.original_width,
        "original_height": element.original_height,
        "image_rotation": 0,
        "to_name": "img",
        "fillColor": "#00ff00",
        "background": "green",
        "value": {
          "x": element.value.x,
          "y": element.value.y,
          "width": element.value.width,
          "height": element.value.height,
          "rotation": 0,
          "rectanglelabels": [element.value.rectanglelabels[0]]
        }
      };
    });
  
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
            </RectangleLabels>
          </View>
        </View>
      `,
      interfaces: [],
      task: {
        annotations: [],
        predictions: [{ result: resultArrUser }],
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
        return annotation.serializeAnnotation();
      },
      onDeleteAnnotation: async function (LS, annotation) {},
      onUpdateAnnotation: async function (LS, annotation) {
        this.marker = annotation.serializeAnnotation().map(({ id, original_height, original_width, value }) => ({ id, original_height, original_width, value }));
        localStorage.setItem('markInfo', JSON.stringify(this.marker));
      }
    });
  
    
    setTimeout(() => {
      const canvasElement = document.querySelector('#label-studio canvas') as HTMLCanvasElement;
      if (canvasElement) {
         this.EvaluatedImagebase64 = canvasElement.toDataURL('image/png');
        // console.log('Base64 Image:', this.EvaluatedImagebase64);
        // localStorage.setItem('base64Image', this.EvaluatedImagebase64);
      }
    }, 1000); 
  
    return this.labelStudio;
  }
  

  // createLabelStudio() {
  //   const resultArrUser = this.userMark.map((element: any) => {
  //     let obj = {
  //       "from_name": "label",
  //       "id": element.id,
  //       "type": "rectanglelabels",
  //       "source": "$image",
  //       "readonly": false,
  //       "canrotate": false,
  //       // "original_width":this.userMark[1]?.original_height,
  //       "original_width": element.original_width,
  //       "original_height": element.original_height,
  //       "image_rotation": 0,
  //       "to_name": "img",

  //       "fillColor": "#00ff00",
  //       "background": "green",
  //       "value":
  //       {
  //         "x": element.value.x,
  //         "y": element.value.y,
  //         "width": element.value.width,
  //         "height": element.value.height,
  //         "rotation": 0,
  //         "rectanglelabels": [
  //           element.value.rectanglelabels[0]
  //         ]
  //       }



  //     }

  //     // console.log(obj)
  //     return obj;
  //     // return element.original_width
  //   })
  //   // const resultArrAI = this.markData.ai_identified_cavities.rectangle_coordinates.map((element: any) => {
  //   //   let obj = {
  //   //     "from_name": "label",
  //   //     "id":element._id,
  //   //     "type": "rectanglelabels",
  //   //     "source": "$image",

  //   //     // "original_width":this.userMark[1]?.original_height,
  //   //     "original_width": "",
  //   //     "original_height": "",
  //   //     "image_rotation": 0,
  //   //     "to_name": "img",

  //   //     "fillColor": "#00ff00",
  //   //     "background": "red",
  //   //     "value":
  //   //     {
  //   //       "x": element.coordinates[0]*100.00/480,
  //   //       "y": element.coordinates[1]*100.00/480,
  //   //       "width": (element.coordinates[2]-element.coordinates[0])*100.0/480,
  //   //       "height":(element.coordinates[3]-element.coordinates[1])*100.0/480,
  //   //       "rotation": 0,
  //   //       "rectanglelabels": [
  //   //         "Add Mark1"
  //   //       ]
  //   //     }
  //   //   }

  //   //   // console.log(obj)
  //   //   return obj;
  //   //   // return element.original_width
  //   // })
  //   // const resultArr = resultArrUser.concat(resultArrAI)
  //   this.labelStudio = new LabelStudio('label-studio', {
  //     config: `
  //     <View style="display:row; flex-direction: column;">
  //     <Style> .Controls_wrapper__1Zdbo { display:none; }</Style>
  //     <Style>.Segment_block__1fyeG {background:transparent !important; border:none; margin-right:0px !important}</Style>
  //     <Style> .Hint_main__1Svrz { display:none; }</Style>
  //     <Style>.ant-tag {background-color:#02d959 !important; color:white !important; font-weight:bold !important;border:none !important}</Style>
  //    <View style="margin-top: -14px;">
  //    <Style> .ImageView_container__AOBmH img</Style>
  //    <Image name="img" value="$image" width="100%" height="100%" ></Image>
  //    <Style> canvas { width:100%; height:100% !important }</Style>
  //    </View>

  //     <View style="flex: 10%;float:right;display:none">
  //     <RectangleLabels name="label" toName="img" background="red" opacity="0.5" strokeWidth="6">
  //     <Label value="1" background="#FF3131" />
  //     <Label value="2" background="#FFFF00" />
  //     <Label value="Make Corrections" background="green" />
  //     </RectangleLabels>

  //     </View>

  //     </View>
  //     `,

  //     interfaces: [
  //       // "panel",
  //       // "update",
  //       //"submit",
  //       // "controls",
  //       // "side-column",
  //       // "annotations:menu",
  //       // "annotations:add-new",
  //       // "annotations:delete",
  //       //"predictions:menu",*/
  //     ],

  //     /* user: {
  //        pk: 1,
  //        firstName: "James",
  //        lastName: "Dean"
  //      },*/

  //     task: {
  //       annotations: [],
  //       predictions: [{
  //         result: resultArrUser
  //       }],
  //       // id: 1,
  //       data: {
  //         image: this.baseLink + this.xRayData[0]?.xray_image.path
         
          
  //       }

  //     },

  //     onLabelStudioLoad: function (LS: { annotationStore: { addAnnotation: (arg0: { userGenerate: boolean; }) => any; selectAnnotation: (arg0: any) => void; }; }) {
  //       var c = LS.annotationStore.addAnnotation({
  //         userGenerate: true
  //       });
  //       LS.annotationStore.selectAnnotation(c.id);
  //     },
  //     onSubmitAnnotation: async function (LS, annotation) {
  //       // console.log(annotation.serializeAnnotation(), "original");

  //       return annotation.serializeAnnotation();
  //     },
  //     onDeleteAnnotation: async function (LS, annotation) {
  //       // console.log("delete btn")
  //       // console.log(annotation.serializeAnnotation())
  //     },

  //     onUpdateAnnotation: async function (LS, annotation) {
  //       this.marker = annotation.serializeAnnotation().map(({ id, original_height, original_width,
  //         value }) => ({ id, original_height, original_width, value }))
  //       // console.log(this.marker[0].id)
  //       // localStorage.setItem('markInfo', ['markInfo']);
  //       localStorage.setItem('markInfo', JSON.stringify(this.marker))
  //       // console.log(annotation.serializeAnnotation());

  //     }


  //   });

    

  //   // console.log(this.labelStudio)
  //   return this.labelStudio;

  // }





  //   async convertImageToBase64(imagePath: string): Promise<string> {
  //   return new Promise<string>((resolve, reject) => {
  //     const img = new Image();
  //     img.onload = () => {
  //       const canvas = document.createElement('canvas');
  //       canvas.width = img.width;
  //       canvas.height = img.height;

  //       const ctx = canvas.getContext('2d');
  //       ctx.drawImage(img, 0, 0, img.width, img.height);

  //       // Get data URL
  //       const dataURL = canvas.toDataURL('image/png');
  //       resolve(dataURL);
  //     };
  //     img.onerror = (error) => reject(error);
  //     img.src = imagePath;
  //   });
  // }


  //



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
    (<HTMLElement>document.getElementsByClassName('ls-update-btn')[0]).click()
    // console.log(this.labelStudio.onSubmitAnnotation, "***")
    // console.log(this.marker)

    // console.log(this.annotations)

    var markInfo = JSON.parse(localStorage.getItem('markInfo') || '[]');
    // console.log(markInfo)
    const markInfo1 = markInfo.filter((elem) => {
      return this.markData.ai_identified_cavities.rectangle_coordinates.every((ele) => {
        return elem.id !== ele._id;
      });
    });
    const AiMarks = this.markData.ai_identified_cavities.rectangle_coordinates.filter((elem) => {
      return markInfo.some((ele) => {
        return elem._id === ele.id;
      });
    });
    // console.log(markInfo1,AiMarks)
    const xray_info = {
      xray_id: this.id,
      user_id: this.xRayData[0]?.user_id,
      marker: markInfo1,


    }
    const ai_info = {
      xray_id: this.id,
      ai_cavities: AiMarks
    }
    this.userService.updateAIData(ai_info).subscribe((res: any) => {
      if (res.success) {
        // console.log("Ai updated")
      }
      else {
        // console.log("Ai not updated")
      }
    })

    // console.log(xray_info)
    this.userService.addEvalData(xray_info).subscribe((res: any) => {
      if (res.success) {
        Swal.fire({
          text: res.message,
          //icon: 'success',
          imageUrl: '../../../../assets/images/success.png',
        });
        document.getElementById('close')?.click();
      } else {
        Swal.fire({
          text: res.message,
          icon: 'error',
        });

      }

    })
    localStorage.removeItem('markInfo')
  }
  renderImage(img: string) {
    if (img) {
      return this.baseLink + img;
    } else {
      return '../assets/images/no-image.jpg';
    }
  }
  handleClick() {
    this.router.navigateByUrl('/upload-xray/0');
  }

  generatePDF() {
    if (!this.first_name || !this.last_name || !this.contact_number || !this.DOB || !this.patient_id || !this.email) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Details',
        text: 'Please ensure all patient details are provided.',
      });
      return;
    }
  
    if (!this.xRayImg || !this.EvaluatedImagebase64) {
      Swal.fire({
        icon: 'error',
        title: 'Missing Images',
        text: 'Please ensure all images are provided.',
      });
      return;
    }
  
    const doc = new jsPDF();
  
    const img1 = new Image();
    img1.src = '../../../../assets/images/arti_new.png';
  
    img1.onload = () => {
      const imgWidth = 25;
      const imgHeight = img1.height * imgWidth / img1.width;
      const imgX = 15;
      const imgY = 5;
      doc.addImage(img1, 'JPEG', imgX, imgY, imgWidth, imgHeight);

      const pageWidth = doc.internal.pageSize.getWidth();
      const textX = pageWidth - 57; 
      doc.setFontSize(10);
      doc.setFont('Helvetica', 'normal');
      
      const textY = imgY + 5; 
      doc.setFontSize(10);
      doc.setFont('Helvetica', 'bold');
      // doc.setTextColor(255, 0, 0); 
      doc.text('Dentist Details ', textX, textY);

      // Reset text color to black for other text
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(0, 0, 0); 
      doc.text(`Name: ${this.userRecord.first_name.charAt(0).toUpperCase() + this.userRecord.first_name.slice(1)} ${this.userRecord.last_name.charAt(0).toUpperCase() + this.userRecord.last_name.slice(1)}`, textX, textY + 5);
      doc.text(`Email: ${this.userRecord.email}`, textX, textY + 10);
      doc.text(`License No: ${this.userRecord.license_no}`, textX, textY + 15);
  
      const heading = ' ARTI Dental Report';
      const textWidth = doc.getStringUnitWidth(heading) * doc.internal.scaleFactor;
      // const pageWidth = doc.internal.pageSize.getWidth();
      const headingX = (pageWidth - textWidth) / 2.1;
      const headingY = imgY + imgHeight + 3;
      doc.setFontSize(14);
      doc.text(heading, headingX, headingY);
  
      const patientDetails = [
        { label: 'Patient ID', value: this.patient_id },
        { label: 'Patient Name', value: `${this.first_name.charAt(0).toUpperCase() + this.first_name.slice(1)} ${this.last_name.charAt(0).toUpperCase() + this.last_name.slice(1)} ` },
        { label: 'Contact Number', value: this.contact_number },
        { label: 'Email ', value: this.email },
        { label: 'Date of Birth', value: this.DOB},
        { label: 'Evaluated Date', value: this.evaluated_Date},
       
      ];
  
      const tableData = patientDetails.map(detail => [detail.label, detail.value]);
  
      const infoY = headingY + 5;
      (doc as any).autoTable({
        startY: infoY,
        head: [['Patient Details', '']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [15, 47, 71] },
        styles: { fontSize: 12 },
        margin: { left: 20 }
      });
  
      const finalY = (doc as any).lastAutoTable.finalY + 8;
      doc.setFontSize(12);
      doc.text(`Evaluated X-Ray`, 90, finalY);
  
      const xRayImg = new Image();
      xRayImg.src = 'data:image/png;base64,' + this.xRayImg;
  
      xRayImg.onload = () => {
        const xRayImgWidth = 70;
        const xRayImgHeight = 75;
        const xRayImgX = (doc.internal.pageSize.getWidth() / 2) - (xRayImgWidth / 2);
        const xRayImgY = finalY + 5;
        doc.addImage(xRayImg, xRayImgX, xRayImgY, xRayImgWidth, xRayImgHeight);
  
        const secondImg = new Image();
        secondImg.src = 'data:image/png;base64,' + this.xRayImg;
  
        secondImg.onload = () => {
          const secondImgWidth = 70;
          const secondImgHeight = 75;
          const secondImgX = (doc.internal.pageSize.getWidth() / 2) - (secondImgWidth / 2);
          const secondImgY = xRayImgY + xRayImgHeight + 15;
          doc.text("Original X-Ray", 90, secondImgY - 5);
          doc.addImage(secondImg, secondImgX, secondImgY, secondImgWidth, secondImgHeight);
  
          const thirdImg = new Image();
          thirdImg.src = this.EvaluatedImagebase64;
  
          thirdImg.onload = () => {
            const thirdImgWidth = 70;
            const thirdImgHeight = 75;
            const thirdImgX = (doc.internal.pageSize.getWidth() / 2) - (thirdImgWidth / 2);
            const thirdImgY =  finalY + 5;
            // doc.text("Evaluated X-Ray", 90, thirdImgY - 5);
            doc.addImage(thirdImg, thirdImgX, thirdImgY, thirdImgWidth, thirdImgHeight);

            let endY =  secondImgY + secondImgHeight + 12;
            const disclaimer = "Disclaimers : The final diagnosis remains the responsibility of the dentist. ARTI serves as an additional diagnostic tool, enhancing the accuracy and efficiency of dental professionals. Decay is deeper than it appears. Your dentist will assess treatment accordingly.";
            const splitText = doc.splitTextToSize(disclaimer, 200); 
            doc.setFontSize(12);
            doc.text(splitText, 10, endY)
              
            const pdfBlob = doc.output('blob');
            const pdfUrl = URL.createObjectURL(pdfBlob);
            window.open(pdfUrl);
          };
        };
      };
    };
  }

  formatEvaluatedDate() {
    const date = new Date(this.evaluated_Date);
    this.formattedEvaluatedDate = new Intl.DateTimeFormat('en-US').format(date);
  }


  

 




  // generatePDF() {
  //   const doc = new jsPDF();

  //   // Add image
  //   const img = new Image();
  //   img.src = '../../../../assets/images/arti_new.png';

  //   img.onload = () => {
  //     const imgWidth = 50;
  //     const imgHeight = img.height * imgWidth / img.width;
  //     const imgX = (doc.internal.pageSize.getWidth() / 2) - (imgWidth / 2);
  //     const imgY = 30;

  //     doc.addImage(img, 'JPEG', imgX, imgY, imgWidth, imgHeight);

  //     // Add patient details
  //     const heading = 'Dental Evaluation Report';
  //     const textWidth = doc.getStringUnitWidth(heading) * doc.internal.scaleFactor; // Adjusted for proper calculation
  //     const headingX = (doc.internal.pageSize.getWidth() / 2.5) - (textWidth / 2.5);
  //     const headingY = imgY + imgHeight + 10;

  //     doc.setFontSize(14);
  //     doc.text(heading, headingX, headingY);

  //     const infoX = 20;
  //     let infoY = headingY + 20;

  //     doc.setFontSize(12);
  //     doc.text(`Patient Name: ${this.first_name} ${this.last_name}`, infoX, infoY);
  //     infoY += 10;
  //     doc.text(`Contact Number: ${this.contact_number}`, infoX, infoY);
  //     infoY += 10;
  //     doc.text(`Date of Birth: ${this.DOB}`, infoX, infoY);
  //     infoY += 10;
  //     doc.text(`Patient ID: ${this.patient_id}`, infoX, infoY);
  //     infoY += 20;
  //     doc.text(`Original X-Ray`, infoX, infoY);



  //     const xRayImgPath = this.renderImage(this.xRayData[0]?.xray_image.path);
  //     console.log(xRayImgPath, ">>>>>>>>>>>>>");

  //     if (xRayImgPath) {
  //       // Create new Image object with fetched data
  //       const xRayImg = new Image();
  //       xRayImg.src = xRayImgPath;

  //       xRayImg.onload = () => {
  //         const xRayImgWidth = 100; // Adjust as needed
  //         const xRayImgHeight = xRayImg.height * xRayImgWidth / xRayImg.width;
  //         const xRayImgX = (doc.internal.pageSize.getWidth() / 2) - (xRayImgWidth / 2);
  //         const xRayImgY = infoY + 20; // Adjust as needed

  //         // Add X-ray image to PDF
  //         doc.addImage(xRayImg, 'JPEG', xRayImgX, xRayImgY, xRayImgWidth, xRayImgHeight);
  //       };
  //     }

  //      doc.save('patient_evaluation_report.pdf');
  //   };
  // }

  // generatePDF() {
  //   const doc = new jsPDF();

  //   // Add image
  //   const img = new Image();
  //   img.src = '../../../../assets/images/arti_new.png';

  //   img.onload = () => {
  //     const imgWidth = 50;
  //     const imgHeight = img.height * imgWidth / img.width;
  //     const imgX = (doc.internal.pageSize.getWidth() / 2) - (imgWidth / 2);
  //     const imgY = 30;

  //     doc.addImage(img, 'JPEG', imgX, imgY, imgWidth, imgHeight);

  //     // Add patient details
  //     const heading = 'Dental Evaluation Report';
  //     const textWidth = doc.getStringUnitWidth(heading) * doc.internal.scaleFactor; // Adjusted for proper calculation
  //     const headingX = (doc.internal.pageSize.getWidth() / 2.5) - (textWidth / 2.5);
  //     const headingY = imgY + imgHeight + 10;

  //     doc.setFontSize(14);
  //     doc.text(heading, headingX, headingY);

  //     const infoX = 20;
  //     let infoY = headingY + 20;

  //     doc.setFontSize(12);
  //     doc.text(`Patient Name: ${this.first_name} ${this.last_name}`, infoX, infoY);
  //     infoY += 10;
  //     doc.text(`Contact Number: ${this.contact_number}`, infoX, infoY);
  //     infoY += 10;
  //     doc.text(`Date of Birth: ${this.DOB}`, infoX, infoY);
  //     infoY += 10;
  //     doc.text(`Patient ID: ${this.patient_id}`, infoX, infoY);
  //     infoY += 20;
  //     doc.text(`Original X-Ray`, infoX, infoY);

  //     // Fetch X-ray image via proxy server
  //     const xRayImgUrl = this.xRayData[0]?.xray_image.path;
  //     const proxyImageUrl = `http://localhost:3000/fetch-image?imageUrl=${encodeURIComponent(xRayImgUrl)}`;

  //     fetch(proxyImageUrl)
  //       .then(response => response.blob())
  //       .then(imageBlob => {
  //         const xRayImg = new Image();
  //         xRayImg.src = URL.createObjectURL(imageBlob);

  //         xRayImg.onload = () => {
  //           const xRayImgWidth = 100; // Adjust as needed
  //           const xRayImgHeight = xRayImg.height * xRayImgWidth / xRayImg.width;
  //           const xRayImgX = (doc.internal.pageSize.getWidth() / 2) - (xRayImgWidth / 2);
  //           const xRayImgY = infoY + 20; // Adjust as needed

  //           // Add X-ray image to PDF
  //           doc.addImage(xRayImg, 'JPEG', xRayImgX, xRayImgY, xRayImgWidth, xRayImgHeight);

  //           // Generate the PDF as data URI
  //           const pdfDataUri = doc.output('datauristring');

  //           // Open the PDF in a new tab
  //           window.open(pdfDataUri, '_blank');
  //         };
  //       })
  //       .catch(error => {
  //         console.error('Error fetching X-ray image:', error);
  //         // Handle error
  //       });
  //   };
  // }

}




