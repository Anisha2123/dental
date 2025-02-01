
const nodemailer = require('nodemailer');
require('dotenv').config();

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

const sendEmail = (formData) => {
  console.log(`in mail.js`);
  const mailOptions = {
    from: process.env.BREVO_SMTP_MAIL,
    to: [
      'Iamvarshita@gmail.com',
      'info@4edental.com',
      formData.email, // Send to the email provided in the form
    ],
    subject: 'Demo Booking Request',
    html: `
      <h2>New Demo Booking Request</h2>
      <p><strong>First Name:</strong> ${formData.fname}</p>
      <p><strong>Last Name:</strong> ${formData.lname}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Phone:</strong> ${formData.phone}</p>
      <p><strong>Comments:</strong> ${formData.comments}</p>
      <p><strong>Selected Date:</strong> ${formData.date}</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
