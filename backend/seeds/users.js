const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const config = require('../config/database')

mongoose.set('strictQuery', true);
mongoose.connect('mongodb://localhost/dark_mountain_dentist', {}).then(() => { 
    console.log('MONGO CONNECTION OPEN!!!');
}).catch((err) => { 
    // console.log(err);
});


const createSuperadminSeed = async () => {
    let d1 = new Date(1686196800000)
    let d2 = new Date(1686306600000)
    try {
    //   const dataBody = {
    //     first_name: 'ken',
    //     last_name: 'kaneki',
    //     email: 'ken@yopmail.com',
    //     password: 'Aa@12345',
    //     age: 34,
    //     city: "Indore",
    //     role: "admin",
    //   }
      const dataBody = [
        {
        "first_name":"anas",
        "last_name":"ahmed",
        "email":"anas.expired@yopmail.com",
        "password":"Aa@12345",
        "role":"dentist",
        "subscription_details.status":false,
        "subscription_details.country":"India",
        "subscription_details.plan_name":"gold",
        "subscription_details.amount":30,
        "subscription_details.type":"Monthly",
        "subscription_details.start_date":d1,
        "subscription_details.end_date":d2,
        "subscription_details.subscription_id":"648207d202b0554cbb50b41c",
        "flag":0,
        "noOfXrayUploaded":0,
        "noOfXrayEvaluated":0,
        "noOfXrayMarkedByAdmin":0,
        // "all_subscription_details[0].status":true,
        // "all_subscription_details[0].country":"India",
        // "all_subscription_details[0].plan_name":"gold",
        // "all_subscription_details[0].amount":30,
        // "all_subscription_details[0].type":"Monthly",
        // "all_subscription_details[0].start_date":d1,
        // "all_subscription_details[0].end_date":d2,
        // "all_subscription_details[0].subscription_id":"648207d202b0554cbb50b41c",
        "city":"Tokyo",
        "contact_number":1237894650,
        "country":"Japan",
        "license_no":"rln2135468",
        "pincode":546879,
        "state":"Tokyo",
        "paypal_ID":"I-W31ANGPU5X5M"
      }
    ]

      const hashedPassword = await bcrypt.hash('Aa@12345', 12);
      dataBody[0].password = hashedPassword;
      const isAlreadyExist = await User.findOne({email: dataBody[0].email});
     
      if (!isAlreadyExist) {
        const addSuperadmin = await User.insertMany(dataBody);
        if (!addSuperadmin) {
          throw new Error("Not able to add user");
        } else {
          // console.log("User created successfully", addSuperadmin, ObjectId(addSuperadmin[0]._id));
          let subsDetails = {
            "status":false,
            "country":"India",
            "plan_name":"gold",
            "amount":30,
            "type":"Monthly",
            "start_date":d1,
            "end_date":d2,
            "subscription_id":"648207d202b0554cbb50b41c",
          }
          const updateUser = await User.findByIdAndUpdate(addSuperadmin[0]._id, {
            $push: {
              all_subscription_details: subsDetails
            }
          });
          if(!updateUser){
            // console.log("plan not added to array", updateUser)
          } else {
            // console.log("User updated successfully")
          }
        }
      } else {
        throw new Error("User email already exists");
      }
    } catch (err) {
      // console.error(err);
    }
  }

  createSuperadminSeed().then(() => {
  
  })