const mongoose = require("mongoose");
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const config = require('../config/database')

mongoose.connect('mongodb://localhost/dark_mountain_dentist', {}).then(() => {
    // console.log('MONGO CONNECTION OPEN!!!', config.DBConnection);
}).catch((err) => {
    // console.log(err);
});


const createSuperadminSeed = async () => {
    try {
      const dataBody = {
        first_name: 'Super',
        last_name: 'Admin',
        email: 'jimmisto@aol.com',
        password: 'Admin@12345',
        age: 34,
        city: "Indore",
        role: "admin",
      }
      const hashedPassword = await bcrypt.hash('Admin@12345', 12);
      dataBody.password = hashedPassword;
      const isAlreadyExist = await User.findOne({email: dataBody.email});
     
      if (!isAlreadyExist) {
        const addSuperadmin = await new User(dataBody).save();
        if (!addSuperadmin) {
          throw new Error("Not able to add user");
        } else {
        console.log("User created successfully");
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