var mongoose = require("mongoose");

const evaluation = mongoose.Schema({
  xray_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "xray",

  },
  ai_identified_cavities: {
      
      rectangle_coordinates:[{
        coordinates: []
      }],
      color_labels:[Number],
      model_version:String,
      accuracy_score:[Number],
      final_cnt_cavities:Number,
      final_cnt_detections:Number,
      final_cnt_probable_cavities:Number,
      final_image_path:String,
      image_name: String,
      primary_model_cnt_detections:Number,
      primary_model_image_path:String,
      secondary_model_cnt_detections:Number,
      secondary_model_image_path:String,
      tags:[String]

  },
  dentist_correction: {
    type: [{
      id: String,
      original_height:Number,
      original_width:Number,
      value: {
        height: Number,
        width: Number,
        rectanglelabels: Array,
        x: Number,
        y: Number,
       
      },

    }],

  },
  admin_correction: {
    type: [{
      id: String,
      original_height:Number,
      original_width:Number,
      value: {
        height: Number,
        width: Number,
        rectanglelabels: Array,
        x: Number,
        y: Number,
      },

    }],

  },
 
  accurate_val: {
    type: Number,
    default:null
  },
  evaluated_by: {
    type: mongoose.Schema.Types.ObjectId,
    default: undefined,
    ref: "User"
  },
  evaluated_patient: {
    type: mongoose.Schema.Types.ObjectId,
    default: undefined,
    ref: "patient_details"
  },
  evaluated_on: {
    type: Date,

  },
  evaluation_status:{
    type: Boolean,
    default:false,
  },
  flag :{
    type: Number,
    enum: [0,1],
     default: 0 
 },
 total_AI_count: {
  type: Number,
  default: 0
 },
 final_AI_count: {
  type: Number,
  default: 0
 },
 final_dentist_count: {
  type: Number,
  default: 0
 },
 total_dentist_count: {
  type: Number,
  default: 0
 },
 admin_count: {
  type: Number,
  default: 0
 },
})

module.exports = mongoose.model("evaluation", evaluation);


