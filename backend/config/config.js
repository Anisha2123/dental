const dotenv = require('dotenv')
dotenv.config();

module.exports = {
   admin_jwt_secret: process.env.ADMIN_JWT_SECRET,
   user_jwt_secret: process.env.USER_JWT_SECRET,
   JWT_SECRET: process.env.JWT_SECRET,
   DRIVE_CLIENT_ID: process.env.DRIVE_CLIENT_ID,
   DRIVE_CLIENT_SECRET: process.env.DRIVE_CLIENT_SECRET,
   DRIVE_REDIRECT_URI: process.env.DRIVE_REDIRECT_URI,
   //! needs to update every 7 day
   DRIVE_REFRESH_TOKEN: process.env.DRIVE_REFRESH_TOKEN,
   SMTP_EMAIL_SERVICE: process.env.SMTP_EMAIL_SERVICE,
   SMTP_EMAIL_ID: process.env.SMTP_EMAIL_ID,
   SMTP_EMAIL_PWD: process.env.SMTP_EMAIL_PWD,
   PAYPAL_PROD_ID: process.env.PAYPAL_PROD_ID,
   MAIL_LOGO: '/../public/logo/arti-image.png',
   AI_URL: process.env.AI_URL,
   LOGIN_JWT_TOKEN: process.env.JWT_TOKEN,
   FORGOT_PWD_KEY: process.env.FORGOT_PWD_KEY,
   PAYPAL_API: process.env.PAYPAL_API,
   PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
   PAYPAL_CLIENT_SECRET_KEY: process.env.PAYPAL_CLIENT_SECRET_KEY,
}