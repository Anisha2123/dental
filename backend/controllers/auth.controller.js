const messages = require("../config/messages");
const User = require("../models/user");
const _ = require("lodash");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const config = require("../config/config");
const sgMail = require('@sendgrid/mail')
const fs = require("fs");

const loginAuth = (req, res) => {

    const regex = /^([a-zA-Z0-9_\.\-\+])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    if (req.body.email == undefined || req.body.password == undefined) {
        return res.status(404).send({ error: "Please fill all the required fields." })
    } else if (!regex.test(req.body.email)){
        return res.status(550).send({error: "Please type proper format of email."})
    } else if (req.body.password.length < 6) {
        return res.status(500).send({ error: "Password should be at least 6 digits." })
    }

    User.findOne({ email: req.body.email.toLowerCase().trim() }).exec((err, userFound) => {
        if (err) {
            return res.status(500).send({ error: "Internal server error." })
        } else if (!(userFound && userFound.validatePassword(req.body.password))) {
            res.status(401).send({ error: "Email or password is incorrect. Please try again or sign up using different email" })
        } else {
            const claims = {
                name: userFound.first_name,
                email: userFound.email,
                scope: userFound.role,
            };

            const access_token = jwt.sign(claims, config.LOGIN_JWT_TOKEN, {
                algorithm: 'HS256',
                expiresIn: 180000,
            });

            const refresh_token = jwt.sign(claims, config.LOGIN_JWT_TOKEN, {
                algorithm: 'HS256',
                expiresIn: 180000,
            });

            // jwt set in cookie
            res.cookie('access_token', access_token, {
                httpOnly: true,
                maxAge: 180000,
                // sameSite: 'none',
                // secure: true,
            });
            res.cookie('refresh_token', refresh_token, {
                httpOnly: true,
                maxAge: 180000,
                // sameSite: 'none',
                // secure: true,
            });
            res.status(200).send({ msg: userFound });
        }
    })
}

const refresh = (req, res) => {
    const claims = {
        name: userFound.first_name,
        email: userFound.email,
        scope: userFound.role,
    };
    try {
        const access_token = jwt.sign(claims, config.LOGIN_JWT_TOKEN, {
            algorithm: 'HS256',
            expiresIn: 180000
        });
        const refresh_token = jwt.sign(claims, config.LOGIN_JWT_TOKEN, {
            algorithm: 'HS256',
            expiresIn: 180000
        });

        // parsing in cookie
        res.cookie('access_token', access_token, {
            httpOnly: true,
            maxAge: 180000,
            // secure: true
        });
        res.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            maxAge: 180000,
            // secure: true
        });
        res.status(200).send({ msg: "Login successful" });
    } catch (e) {
        // console.warn(e);
    }
}

const forgotPassword =  (req, res) => {
    var {email} = req.body;
    
    console.log(email,"email");
    
    if(email){
        email = email.toLowerCase().trim();
    }

    User.findOne({email}, async (err, user) => {
        if(err || !user){
            return res.status(400).json({error: "User with this email does not exists."})
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        const token = jwt.sign({_id: user._id, otp: otp}, config.FORGOT_PWD_KEY, {expiresIn: '10m'})
      
        let date = new Date().toLocaleString();
        // console.log(date);
        pathToAttachment = __dirname + config.MAIL_LOGO;
        attachment = fs.readFileSync(pathToAttachment).toString("base64");
        //console.log(attachment)
        //return
        sgMail.setApiKey(process.env.Sendgrid_APIKey)
        const mailOptions = { 
            from: `"ARTI" <${config.SMTP_EMAIL_ID}>`,
            to: email,
            subject: `OTP for Password Reset.`,
            // attachments: [{
            //     filename: 'arti-image.png',
            //     path: __dirname + config.MAIL_LOGO,
            //     cid: 'logo'
            // }],
            attachments: [{
                content: attachment,
                filename: 'arti-image.png',
                type: "application/image",
                disposition: "attachment"
              }],
           
            html: `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <style>
                * {
                    padding: 0%;
                    margin: 0%;
                    box-sizing: border-box;
                    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
                }
                </style>
                <title>ARTI</title>
            </head>
            <body style="width: 100%">
                <table
                style="
                    margin: 0% auto;
                    background-color: #f0f0f0;
                    padding: 15px 25px 20px 15px;
                "
                >
                <thead>
                    <tr>
                    <th>
                        <div>
                        <img
                            src="cid:logo"
                            alt=""
                            style="width: 100px"
                        />
                        </div>
                        <br />
                    </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td>
                        <b>Hi ${user.first_name},</b>
                    </td>
                    </tr>
                    <tr>
                    <td>
                        <br>
                        <p style="text-align: left">
                        Your OTP to reset your password is <b>${otp}</b>. This OTP is valid only for 10 mins. 
                        </p>
                    </td>
                    </tr>
                    <tr>
                    <td>
                        <br />
                        <p>Thank you</p>
                    </td>
                    </tr>
                    <tr>
                    <td>
                        <b>Team ARTI</b>
                    </td>
                    </tr>
                    <tr>
                    <td>
                        <br />
                        <em style="margin-top: 15px"
                        >This is an automated message, please do not reply.</em
                        >
                    </td>
                    </tr>
                </tbody>
                </table>
            </body>
            </html>
          `
        };
        sgMail
        .send(mailOptions)
        .then(() => {
            res.send({data: token, otp: otp})
          //console.log('Email sent')
        })
        .catch((error) => {
          console.error(error)
        })
    })
}

const resetPassword = (req, res) => {
    var {email, token, otp} = req.body;

    if(email){
        email = email.toLowerCase().trim();
    }

    User.findOne({email}, (err, user) => {
        // optional to search for user
        if(err || !user){
            return res.status(400).json({error: "User with this email does not exists."})
        }

        jwt.verify(token, config.FORGOT_PWD_KEY, (error, decodedData) => {
            if(error){
                return res.status(401).json({
                    error: "OTP expired"
                })
            } else if (decodedData.otp != otp){
                return res.status(401).json({
                    error: "Incorrect otp"
                })
            } else if (decodedData.otp == otp) {
                res.status(200).send({success: "Success"})
            } else {
                res.status(740).send({error: "Please enter correct otp."})
            }
            // console.log(decodedData.otp, "Decoded");
        })
    })
}

const updatePassword = (req, res) => {
    let {email, newPass, cnfPass} = req.body;

    // // console.log(email, newPass, cnfPass);

    if(email){
        email = email.toLowerCase().trim();
    }

    newPass = newPass.trim();
    cnfPass = cnfPass.trim();

    if(newPass === cnfPass){
        if(newPass.length < 6 && cnfPass.length < 6){
            return res.status(400).json({error: messages.PASSWORD_6DIGIT})
        }
        User.findOne({email}, (err, user) => {
            if (err || !user) {
                return res.status(400).json({ error: "User with this token does not exists." });
            }

            const obj = {
                password: user.generateHash(newPass)
            }

            user = _.extend(user, obj);
            user.save((error, result) => {
                if(error){
                    return res.status(400).json({error: "Reset password error."})
                } else {
                    return res.status(200).json({message: "Your password has been changed."})
                }
            })
        })
    } else {
        return res.status(400).json({error: "New Password and Confirm Password field do not match, please try again."})
    }
}

module.exports = {
    loginAuth,
    refresh,
    forgotPassword,
    resetPassword,
    updatePassword
}