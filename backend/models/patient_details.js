var mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


const patient_details = mongoose.Schema({
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
    DOB: {
        type:mongoose.Schema.Types.Mixed
    },
    // role: {
    //     type: String,
    //     enum: ["admin", "dentist"],
    //     default: "dentist" // 1 for admin 0 for Superadmin
    // },
    reference_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: undefined
    },
    patient_unique_id: {
        type: Number,
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
   
});

module.exports = mongoose.model('patient_details', patient_details);