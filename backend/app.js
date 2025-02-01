const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
const configs = require('./config/database');
const indexRouter = require('./routes/index');
const sgMail = require('@sendgrid/mail')
//var xrayRouter = require('./routes/uploadXray.routes');
//////const AuthRouter = require("./routes/auth.routes");
// const userRoutes = require("./routes/user");
const nodemailer = require('nodemailer');
// const sendEmail = require('./controllers/mail');
const dotenv = require('dotenv')
dotenv.config();






var app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// const cors = require('cors');
// app.use(cors());
app.use(cors({ origin: '*' }));  // Update with EC2 IP

// Middleware to parse JSON requests
app.use(express.json());
const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com', // Brevo SMTP relay
    port: 587,
    secure: false,
    auth: {
        user: process.env.BREVO_SMTP_USER,  // From .env
        pass: process.env.BREVO_SMTP_PASS   // From .env
    },
    tls: {
        rejectUnauthorized: false // ✅ Ignore self-signed certificate error
    }
}); 
app.post('/book-demo', (req, res) => {
  const { fname, lname, email, phone, comments, date } = req.body;

  if (!email) {
      return res.status(400).json({ error: "User email is required" });
  }

  const mailOptions = {
      from: process.env.BREVO_SMTP_MAIL, // Sender email
      to: `Iamvarshita@gmail.com, info@4edental.com, ${email}`, // Send to all three
      subject: "New Demo Booking Request",
      text: `New demo booking request:
      
      Name: ${fname} ${lname}
      Email: ${email}
      Phone: ${phone}
      Comments: ${comments}
      Date: ${date}
      `
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.error("Error sending email:", error);
          return res.status(500).json({ error: "Error sending email" });
      }
      console.log("Email sent:", info.response);
      res.status(200).json({ message: "Form submitted and emails sent successfully!" });
  });
});

// POST route to handle form submission and send an email
app.post('/contact-form', (req, res) => {
  const { fname, lname, email, phone, comments, date } = req.body;

  if (!fname || !lname || !email || !phone || !comments || !date) {
      return res.status(400).json({ error: "All fields are required" });
  }

  const mailOptions = {
      from: process.env.BREVO_SMTP_MAIL, // Sender email
      to: 'info@4edental.com', // Send to this single email
      subject: "New Contact Form Submission",
      text: `New contact form submission:
      
      Name: ${fname} ${lname}
      Email: ${email}
      Phone: ${phone}
      Comments: ${comments}
      Preferred Date: ${date}
      `
  };

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.error("Error sending email:", error);
          return res.status(500).json({ error: "Error sending email" });
      }
      console.log("Email sent:", info.response);
      res.status(200).json({ message: "Form submitted and email sent successfully!" });
  });
});


// app.post('http://localhost:4000/book-demo', async (req, res) => {
//   const formData = req.body;
//   console.log('Received data:', req.body); // Debugging
//   try {
//     await sendEmail(formData);
//     res.status(200).send({ message: 'Form submitted successfully!' });
//   } catch (error) {
//     console.error('Error sending email:', error);
//     res.status(500).send({ message: 'Something went wrong. Please try again.' });
//   }
// });



// ---------------------------------------------
// --------- Create Database Connection --------
// ---------------------------------------------
mongoose.set('strictQuery', true);
mongoose.connect(configs.DBConnection, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
}).then(() => {
    console.log("Successfully connected to MongoDB");

    // Log the database name
    const dbName = mongoose.connection.name; // This gets the database name from the connection
    console.log(`Connected to database: ${dbName}`);

    // Log available collections
    mongoose.connection.db.listCollections().toArray((err, collections) => {
        if (err) {
            console.error("Error fetching collections:", err);
        } else {
            console.log('Available collections:', collections.map(c => c.name));
        }
    });
}).catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit the app if MongoDB connection fails
});

// ---------------------------------------------
// --------- Parsing the body ------------------
// ---------------------------------------------
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));
app.use(bodyParser.json({ limit: '500mb', extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// --------- setting images statically ---------
// app.use('/public', express.static(path.join(__dirname, '../public')));
// app.use('/public', serveIndex(path.join(__dirname, '../public')));

// ---------------------------------------------
// --------- set access permission to origin ---
// ---------------------------------------------
app.options('*', cors());
// app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", '*');
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS,PATCH");
  res.header("Access-Control-Allow-Headers", "*");
  res.header('Access-Control-Allow-Credentials', true);
  next();
}); 
// ---------------------------------------------
// --------- Calling Router --------------------
// ---------------------------------------------

const rootPath = path.join(__dirname)
// console.log(rootPath);
app.use('/api', indexRouter);
//admin
app.use(express.static('./www'));

app.get('*', (req, res) => {
  return res.sendFile(path.join(rootPath,'./www/index.html'));
});
//app.use('/xray', xrayRouter);

// ---------------------------------------------
// --------- view engine setup -----------------
// ---------------------------------------------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// ---------------------------------------------
// --------- use application utilities ---------
// ---------------------------------------------
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// ---------------------------------------------
// --- catch 404 and forward to error handler --
// ---------------------------------------------
app.use(function(req, res, next) {
  next(createError(404));
});

// const API_KEY = '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'
// sgMail.setApiKey(process.env.Sendgrid_APIKey)
// const msg = {
//   to: 'dev.karma@yopmail.com', // Change to your recipient
//   from: 'info@4edentalai.com', // Change to your verified sender
//   subject: 'Sending with SendGrid is Fun',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// }
// sgMail
//   .send(msg)
//   .then(() => {
//     console.log('Email sent')
//   })
//   .catch((error) => {
//     console.error(error,'piyusssssss')
//   })
// ---------------------------------------------
// ---------- error handler --------------------
// ---------------------------------------------
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// ---------------------------------------------
// --------- Path given here for www --------
// ---------------------------------------------

// console.log(__dirname, "CHECK DIR")



module.exports = app;
