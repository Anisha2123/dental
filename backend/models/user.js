var mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const subSchema = new mongoose.Schema({
    subscription_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "subscription",
        default: undefined
    },
    start_date: {
        type: Date,
        default: undefined
    },
    end_date: {
        type: Date,
        default: undefined
    },
    status: {
        type: Boolean,
        default:false
        
    },
    payment_timeEpoc:{
        type: String,
    },
    payment_status:{
        type: String,
    },
  
    transction_id:{
        type: String,
    },
    order_id:{
        type: String,
    },
    razorpay_signature:{
        type: String,
    },
    name: {
        type: String,
    },
    price: {
        type: String,
    },
    country: {
        type:Array
    },
    currency: {
        type: String,
    },
    type: {
        type: String,
    }
})

const User = mongoose.Schema({
    first_name: {
        type: String,
        trim: true,
        required: true
    },
    last_name: {
        type: String,
        trim: true,
        required: true
    },
    contact_number: {
        type: Number,
        trim: true
    },
    email: {
        type: String,
        trim: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    address1: {
        type: String,
        default: null
    },
    address2: {
        type: String,
        default: null
    },
    role: {
        type: String,
        enum: ["admin", "dentist"],
        default: "dentist" // 1 for admin 0 for Superadmin
    },
    accuracy: {
        type: Number,
        default: 0
    },
    
    paypal_ID: {
        type: String,
    },
    city: {
        type: String,
        trim: true,
    },
    state: {
        type: String,
        trim: true,
    },
    country: {
        type:Array,
        trim: true,
    },
    currency: {
        type: String,
        trim: true,
    },
    pincode: {
        type: Number,
        trim: true,
    },
    license_no:{
        type: String,
        trim: true,
    },
    subscription_details: {
        subscription_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "subscription",
            default: undefined
        },
        start_date: {
            type: Date,
            default: undefined
        },
        end_date: {
            type: Date,
            default: undefined
        },
        status: {
            type: Boolean,
            default:false
            
        },
        payment_timeEpoc:{
            type: String,
        },
        payment_status:{
            type: String,
        },
      
        transction_id:{
            type: String,
        },
        order_id:{
            type: String,
        },
        razorpay_signature:{
            type: String,
        },
        name: {
            type: String,
        },
        price: {
            type: String,
        },
        country: {
            type:Array,
        },
        currency: {
            type: String,
        },
        type: {
            type: String,
        },
        stripepriceID: {
            type: String,
        },
        stripepaymentID: {
            type: String,
        }
    },
    all_subscription_details:[
        subSchema
    ],
  

    updated_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: undefined
    },
    created_at: {
        type: Date,
        default: Date.now()
    },
    updated_at: {
        type: Date,
        default: undefined
    },
    flag :{
       type: Number,
       enum: [0,1],
        default: 0 
    },
    noOfXrayUploaded :{
        type: Number,
        default:0
    },
    noOfXrayEvaluated:{
        type: Number,
        default:0
    },
    noOfXrayMarkedByAdmin :{
        type: Number,
        default:0
    },
});



User.methods.generateHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null)
}

User.methods.validatePassword = function (password) {
    const result = bcrypt.compareSync(password, this.password);
    return result; 
}

module.exports = mongoose.model('User', User);