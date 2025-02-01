const nodemailer = require("nodemailer");
const config = require("../config/config");
const messages = require("../config/messages");
const User = require("../models/user");
const fetch = require("node-fetch");
const Xray = require("../models/xray")
const sgMail = require('@sendgrid/mail')
const fs = require("fs");


exports.sendDailyReminder = async () => {
    try {
        // console.log("SEND DAILY REMINDER 001")

        // const email = "anas31197@gmail.com"

        const userListDentist = await User.find({ "role": "dentist", "subscription_details.status": true })

        // console.log(userListDentist)

        if (userListDentist.length == 0) {
            return res.send({
                success: false,
                message: messages.ERROR
            })
        }

        // let transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //         type: 'OAuth2',
        //         user: config.MAIL_USERNAME,
        //         pass: config.MAIL_PASSWORD,
        //         clientId: config.OAUTH_CLIENTID,
        //         clientSecret: config.OAUTH_CLIENT_SECRET,
        //         refreshToken: config.OAUTH_REFRESH_TOKEN
        //     }
        // });

        // let transporter = nodemailer.createTransport({
        //     host: config.SMTP_EMAIL_SERVICE,
        //     port: 587,
        //     // secure: true, // upgrade later with STARTTLS
        //     auth: {
        //         user: config.SMTP_EMAIL_ID,
        //         pass: config.SMTP_EMAIL_PWD,
        //     },
        // })
       

        let date = new Date().toLocaleString();
        // console.log(date);

        let date1 = new Date();
        let date2 = new Date();

        userListDentist.forEach(async (elem) => {
            // console.log(elem, "FIRST");
            var getXray = await Xray.count({
                user_id: elem._id,
                evaluation_status: true,
                created_at: {
                    $lte: new Date(date2),
                    $gte: new Date(date2.setDate(date2.getDate() - 1))
                }
            })
            if(!getXray){
                getXray = 0;
            }
            var getData = await Xray.aggregate([
                {
                    $match: {
                        "user_id": elem._id,
                        "created_at": {
                            $lte: new Date(date1),
                            $gte: new Date(date1.setDate(date1.getDate() - 1))
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'evaluations',
                        localField: '_id',
                        foreignField: 'xray_id',
                        as: "evaluation",
                    },
                },
                {
                    $project: {
                        'evaluation.ai_identified_cavities.color_labels': 1,
                    }
                }
            ])
            count = 0;
            if(!getData){
                count = 0;
            } else if (getData.length > 0){
                for (let i = 0; i < getData.length; i++) {
                    // return(getData[i].evaluation.ai_identified_cavities.color_labels.length?getData[i].evaluation.ai_identified_cavities.color_labels.length+count:count)
                    if (getData[i].evaluation.length > 0) {
                        let n = getData[i].evaluation[0]?.ai_identified_cavities?.color_labels?.length
                        // console.log("empty", n)
                        if (n == undefined) {
                            // console.log(n, undefined)
                        } else {
                            count += getData[i].evaluation[0]?.ai_identified_cavities?.color_labels?.length
                        }
                        // // console.log(getData[i].evaluation[0].ai_identified_cavities,"-+-")
                    }
                    else {
                        // console.log("not empty")
                    }
                }
            }
            // console.log(getData, "SECOND", count);
            // console.log(getXray, "LIST");
            pathToAttachment = __dirname + config.MAIL_LOGO;
            attachment = fs.readFileSync(pathToAttachment).toString("base64");
            //console.log(attachment)
            //return
            sgMail.setApiKey(process.env.Sendgrid_APIKey)
            const mailOptions = {
                from: `"ARTI" <${config.SMTP_EMAIL_ID}>`,
                to: elem.email,
                subject: `Your Daily ARTI Activity Stats for the day.`,
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
                            <b>Hi ${elem.first_name},</b>
                        </td>
                        </tr>
                        <tr>
                        <td>
                            <p style="text-align: left">
                            Please find here your ARTI usage Stats for the day – ${date}.
                            </p>
                        </td>
                        </tr>
                        <tr>
                        <td>
                            <br>
                            <table>
                            <tbody>
                                <tr>
                                <td style="text-align: left; padding: 5px">${getXray} X-rays Evaluated by ARTI</td>
                                </tr>
                                <tr>
                                <td style="text-align: left; padding: 5px">${count} Cavities Detected by ARTI</td>
                                </tr>
                                <tr>
                                <td style="text-align: left; padding: 5px">$${count * 50} Revenue from ARTI</td>
                                </tr>
                            </tbody>
                            </table>
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
                //res.send({email})
              //console.log('Email sent')
            })
            .catch((error) => {
              console.error(error)
            })
            // transporter.sendMail(mailOptions, (error, info) => {
            //     if (error) {
            //         // console.log(error);
            //     } else {
            //         // console.log(info.accepted, info.rejected, 'Email Send Successfully');
            //         // res.send({ email:  })
            //     }
            // })
        });
    } catch (e) {
        // console.log(e)
    }
}

exports.sendReminderForPendingSubs = async () => {
    try {
        let date = new Date();

        // ! 1 days ago
        let data = {
            'role': 'dentist',
            'subscription_details.status': false,
            'created_at': {
                '$lte': new Date(date.getTime()),
                '$gte': new Date(date.setDate(date.getDate() - 1))
            }
        }
        // start_date : {$gte: }
        const pendingUserList = await User.find(data);
        // console.log("!!!", pendingUserList, "!!!", new Date(date.getTime() + 60 * 60 * 24 * 1000))
        // let transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //         type: 'OAuth2',
        //         user: config.MAIL_USERNAME,
        //         pass: config.MAIL_PASSWORD,
        //         clientId: config.OAUTH_CLIENTID,
        //         clientSecret: config.OAUTH_CLIENT_SECRET,
        //         refreshToken: config.OAUTH_REFRESH_TOKEN
        //     }
        // });

        // let transporter = nodemailer.createTransport({
        //     host: config.SMTP_EMAIL_SERVICE,
        //     port: 587,
        //     // secure: true, // upgrade later with STARTTLS
        //     auth: {
        //         user: config.SMTP_EMAIL_ID,
        //         pass: config.SMTP_EMAIL_PWD,
        //     },
        // })
        pathToAttachment = __dirname + config.MAIL_LOGO;
        attachment = fs.readFileSync(pathToAttachment).toString("base64");
        //console.log(attachment)
        //return
        sgMail.setApiKey(process.env.Sendgrid_APIKey)
        pendingUserList.map((elem) => {
            // if ((elem.created_at.getTime() + 60 * 60 * 24 * 1000) < date && (elem.created_at.getTime() + 60 * 60 * 36 * 1000) > date) {
            // console.log(new Date(elem.created_at.getTime() + 60 * 60 * 24 * 1000), new Date(elem.created_at.getTime()), (elem.created_at.getTime() + 60 * 60 * 24 * 1000).toLocaleString().length, date.toLocaleString().length)

            const mailOptions = {
                from: `"ARTI" <${config.SMTP_EMAIL_ID}>`,
                to: elem.email,
                subject: `Please Buy an ARTI Subscription Plan.`,
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
                                <img src="cid:logo" alt="" style="width: 100px" />
                                </div>
                                <br />
                            </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <td>
                                <b>Hi ${elem.first_name},</b>
                            </td>
                            </tr>
                            <tr>
                            <td>
                                <br />
                                <p style="text-align: left">
                                Thanks for choosing ARTI as your AI-Based Dental Cavity Detection
                                assistant.
                                </p>
                            </td>
                            </tr>
                            <tr>
                            <td>
                                <br />
                                <p style="text-align: left">
                                Your ARTI Account is created but you haven't subscribed to a valid
                                Plan.
                                </p>
                            </td>
                            </tr>
                            <tr>
                            <td>
                                <br />
                                <p style="text-align: left">
                                Please login to your Account and Subscribe to a Plan.
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
                                <br />
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
            // transporter.sendMail(mailOptions, (error, info) => {
            //     if (error) {
            //         // console.log(error);
            //     } else {
            //         // console.log(info, "Email for subs payment reminder after 24 hours/1 day.");
            //         // res.send({ email: email })
            //     }
            // })

            // }
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

        // ! 3 days ago
        let date1 = new Date();
        let data1 = {
            'role': 'dentist',
            'subscription_details.status': false,
            'created_at': {
                '$lte': new Date(date1.setDate(date1.getDate() - 3)),
                '$gte': new Date(date1.setDate(date1.getDate() - 1))
            }
        }
        const pendingUserList1 = await User.find(data1);

        pendingUserList1.map((elem) => {
            // if ((elem.created_at.getTime() + 60 * 60 * 24 * 1000) < date && (elem.created_at.getTime() + 60 * 60 * 36 * 1000) > date) {
            // // console.log(new Date(elem.created_at.getTime() + 60 * 60 * 24 * 1000), new Date(elem.created_at.getTime()), (elem.created_at.getTime() + 60 * 60 * 24 * 1000).toLocaleString().length, date.toLocaleString().length)
           
            const mailOptions = {
                from: `"ARTI" <${config.SMTP_EMAIL_ID}>`,
                to: elem.email,
                subject: `Please Buy an ARTI Subscription Plan.`,
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
                        <title>Dark Mountain - Email</title>
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
                                <img src="../public/logo/arti-image.png" alt="" style="width: 100px" />
                                </div>
                                <br />
                            </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <td>
                                <b>Hi ${elem.first_name},</b>
                            </td>
                            </tr>
                            <tr>
                            <td>
                                <br />
                                <p style="text-align: left">
                                Thanks for choosing ARTI as your AI-Based Dental Cavity Detection
                                assistant.
                                </p>
                            </td>
                            </tr>
                            <tr>
                            <td>
                                <br />
                                <p style="text-align: left">
                                Your ARTI Account is created but you haven't subscribed to a valid
                                Plan.
                                </p>
                            </td>
                            </tr>
                            <tr>
                            <td>
                                <br />
                                <p style="text-align: left">
                                Please login to your Account and Subscribe to a Plan.
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
                                <br />
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

            // transporter.sendMail(mailOptions, (error, info) => {
            //     if (error) {
            //         // console.log(error);
            //     } else {
            //         // console.log(info, "Email for subs payment reminder after 72 hours/3 days.");
            //         // res.send({ email: email })
            //     }
            // })
            sgMail
            .send(mailOptions)
            .then(() => {
                res.send({data: token, otp: otp})
              //console.log('Email sent')
            })
            .catch((error) => {
              console.error(error)
            })

            // }
        })

        // ! 5 days ago
        let date2 = new Date();
        let data2 = {
            'role': 'dentist',
            'subscription_details.status': false,
            'created_at': {
                '$lte': new Date(date2.setDate(date.getDate() - 5)),
                '$gte': new Date(date2.setDate(date.getDate() - 1))
            }
        }
        const pendingUserList2 = await User.find(data2);

        pendingUserList2.map((elem) => {
            // if ((elem.created_at.getTime() + 60 * 60 * 24 * 1000) < date && (elem.created_at.getTime() + 60 * 60 * 36 * 1000) > date) {
            // // console.log(new Date(elem.created_at.getTime() + 60 * 60 * 24 * 1000), new Date(elem.created_at.getTime()), (elem.created_at.getTime() + 60 * 60 * 24 * 1000).toLocaleString().length, date.toLocaleString().length)

            const mailOptions = {
                from: `"ARTI" <${config.SMTP_EMAIL_ID}>`,
                to: elem.email,
                subject: `Please Buy an ARTI Subscription Plan.`,
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
                        <title>Dark Mountain - Email</title>
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
                                <img src="../public/logo/arti-image.png" alt="" style="width: 100px" />
                                </div>
                                <br />
                            </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <td>
                                <b>Hi ${elem.first_name},</b>
                            </td>
                            </tr>
                            <tr>
                            <td>
                                <br />
                                <p style="text-align: left">
                                Thanks for choosing ARTI as your AI-Based Dental Cavity Detection
                                assistant.
                                </p>
                            </td>
                            </tr>
                            <tr>
                            <td>
                                <br />
                                <p style="text-align: left">
                                Your ARTI Account is created but you haven't subscribed to a valid
                                Plan.
                                </p>
                            </td>
                            </tr>
                            <tr>
                            <td>
                                <br />
                                <p style="text-align: left">
                                Please login to your Account and Subscribe to a Plan.
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
                                <br />
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
            // transporter.sendMail(mailOptions, (error, info) => {
            //     if (error) {
            //         // console.log(error);
            //     } else {
            //         // console.log(info, "Email for subs payment reminder after 72 hours/3 days.");
            //         // res.send({ email: email })
            //     }
            // })

            // }
        })

    } catch (e) {
        // console.log(e)
    }
}

exports.sendRenewalEmail = async () => {
    try {
        const date = new Date()
        // console.log(date, new Date(date.getTime() + 60 * 60 * 24 * 1000 * 10))
        let data = {
            'role': 'dentist',
            'subscription_details.status': false,
            'subscription_details.end_date': { '$lte': new Date(date.getTime() + 60 * 60 * 24 * 1000 * 8), '$gte': new Date(date.getTime() + 60 * 60 * 24 * 1000 * 6) }
        }
        // let transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //         type: 'OAuth2',
        //         user: config.MAIL_USERNAME,
        //         pass: config.MAIL_PASSWORD,
        //         clientId: config.OAUTH_CLIENTID,
        //         clientSecret: config.OAUTH_CLIENT_SECRET,
        //         refreshToken: config.OAUTH_REFRESH_TOKEN
        //     }
        // });

        // secure: true, // upgrade later with STARTTLS
        // let transporter = nodemailer.createTransport({
        //     host: config.SMTP_EMAIL_SERVICE,
        //     port: 587,
        //     auth: {
        //         user: config.SMTP_EMAIL_ID,
        //         pass: config.SMTP_EMAIL_PWD,
        //     },
        // })

        const renewalUserList = await User.find(data);
        // console.log(renewalUserList, "RENEWAL RUNNING")
        pathToAttachment = __dirname + config.MAIL_LOGO;
        attachment = fs.readFileSync(pathToAttachment).toString("base64");
        //console.log(attachment)
        //return
        sgMail.setApiKey(process.env.Sendgrid_APIKey)
        renewalUserList.forEach((elem) => {
            const mailOptions = {
                from: `"ARTI" <${config.SMTP_EMAIL_ID}>`,
                to: elem.email,
                subject: `Your Subscription Expiring in 7 Days.`,
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
                            <b>Hi ${elem.first_name},</b>
                        </td>
                        </tr>
                        <tr>
                        <td>
                            <p style="text-align: left">
                            Your Current Subscription is about to end in 7 Days.
                            </p>
                        </td>
                        </tr>
                        <tr>
                        <td>
                            <br />
                            <p style="text-align: left">
                            You have not registered for automatic renewal.
                            </p>
                        </td>
                        </tr>
                        <tr>
                        <td>
                            <br />
                            <p style="text-align: left">
                            Please renew the current plan manually or login to your ARTI
                            Account to enable Auto Pay to continue using ARTI Services.
                            </p>
                        </td>
                        </tr>
                        <tr>
                        <td>
                            <br />
                            <h4>Current Plan Details:</h4>
                        </td>
                        </tr>
                        <tr>
                        <td>
                            <table>
                            <tbody>
                                <tr>
                                <td style="text-align: left; padding: 5px">Name:</td>
                                <td style="text-align: left; padding: 5px">
                                    ${elem.subscription_details.name}
                                </td>
                                </tr>
                                <tr>
                                <td style="text-align: left; padding: 5px">Plan Type:</td>
                                <td style="text-align: left; padding: 5px">
                                    ${elem.subscription_details.type}
                                </td>
                                </tr>
                                <tr>
                                <td style="text-align: left; padding: 5px">Price:</td>
                                <td style="text-align: left; padding: 5px">
                                    ${elem.subscription_details.price}
                                </td>
                                </tr>
                                <tr>
                                <td style="text-align: left; padding: 5px">
                                    Subscription Ending:
                                </td>
                                <td style="text-align: left; padding: 5px">
                                    ${elem.subscription_details.start_date}
                                </td>
                                </tr>
                            </tbody>
                            </table>
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

            // transporter.sendMail(mailOptions, (error, info) => {
            //     if (error) {
            //         // console.log(error);
            //     } else {
            //         // console.log(info, 'Email for renewal before 10 days.');
            //     }
            // })
            // res.send({ email: email })
        })
    } catch (e) {
        // console.log(e)
    }
}

exports.beforeRecurringPayment = async () => {
    try {
        const date = new Date()
        // console.log(date, new Date(date.getTime() + 60 * 60 * 24 * 1000 * 10))
        let data = {
            'role': 'dentist',
            'subscription_details.status': true,
            'subscription_details.end_date': { '$lte': new Date(date.getTime() + 60 * 60 * 24 * 1000 * 8), '$gte': new Date(date.getTime() + 60 * 60 * 24 * 1000 * 6) }
        }
        // let transporter = nodemailer.createTransport({
        //     service: 'gmail',
        //     auth: {
        //         type: 'OAuth2',
        //         user: config.MAIL_USERNAME,
        //         pass: config.MAIL_PASSWORD,
        //         clientId: config.OAUTH_CLIENTID,
        //         clientSecret: config.OAUTH_CLIENT_SECRET,
        //         refreshToken: config.OAUTH_REFRESH_TOKEN
        //     }
        // });

        // secure: true, // upgrade later with STARTTLS
        // let transporter = nodemailer.createTransport({
        //     host: config.SMTP_EMAIL_SERVICE,
        //     port: 587,
        //     auth: {
        //         user: config.SMTP_EMAIL_ID,
        //         pass: config.SMTP_EMAIL_PWD,
        //     },
        // })
        pathToAttachment = __dirname + config.MAIL_LOGO;
        attachment = fs.readFileSync(pathToAttachment).toString("base64");
        //console.log(attachment)
        //return
        sgMail.setApiKey(process.env.Sendgrid_APIKey)
        const renewalUserList = await User.find(data);
        // console.log(renewalUserList, "RENEWAL RUNNING")
        renewalUserList.forEach((elem) => {
            const mailOptions = {
                from: `"ARTI" <${config.SMTP_EMAIL_ID}>`,
                to: elem.email,
                subject: `Your ARTI Account Set for Automatic Renewal in 7 days.`,
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
                            <b>Hi ${elem.first_name},</b>
                        </td>
                        </tr>
                        <tr>
                        <td>
                            <p style="text-align: left">
                            Your ARTI Account is set to automatically renew in next 7 days. 
                            </p>
                        </td>
                        </tr>
                        <tr>
                        <td>
                            <br />
                            <p style="text-align: left">
                            Please find here the details of your current subscription plan.
                            </p>
                        </td>
                        </tr>
                        <tr>
                        <td>
                            <br />
                            <p style="text-align: left">
                            Please renew the current plan manually or login to your ARTI
                            Account to enable Auto Pay to continue using ARTI Services.
                            </p>
                        </td>
                        </tr>
                        <tr>
                        <td>
                            <br />
                            <h4>Current Plan Details:</h4>
                        </td>
                        </tr>
                        <tr>
                        <td>
                            <table>
                            <tbody>
                                <tr>
                                <td style="text-align: left; padding: 5px">Name:</td>
                                <td style="text-align: left; padding: 5px">
                                    ${elem.subscription_details.name}
                                </td>
                                </tr>
                                <tr>
                                <td style="text-align: left; padding: 5px">Plan Type:</td>
                                <td style="text-align: left; padding: 5px">
                                    ${elem.subscription_details.type}
                                </td>
                                </tr>
                                <tr>
                                <td style="text-align: left; padding: 5px">Price:</td>
                                <td style="text-align: left; padding: 5px">
                                    ${elem.subscription_details.price}
                                </td>
                                </tr>
                                <tr>
                                <td style="text-align: left; padding: 5px">
                                    Subscription Ending:
                                </td>
                                <td style="text-align: left; padding: 5px">
                                    ${elem.subscription_details.start_date}
                                </td>
                                </tr>
                                <tr>
                                <td style="text-align: left; padding: 5px">
                                    Next Billing Date:
                                </td>
                                <td style="text-align: left; padding: 5px">
                                    ${elem.subscription_details.end_date}
                                </td>
                                </tr>
                            </tbody>
                            </table>
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

            // transporter.sendMail(mailOptions, (error, info) => {
            //     if (error) {
            //         // console.log(error);
            //     } else {
            //         // console.log(info, 'Email for renewal before 10 days.');
            //     }
            // })
            // res.send({ email: email })
        })
    } catch (e) {
        // console.log(e)
    }
}

exports.paypalTransaction = async () => {
    try {
        const date = new Date()
        // console.log(new Date(date.getTime()))
        let data = {
            'role': 'dentist',
            'subscription_details.end_date': { '$lte': new Date(date.getTime()) }
        }

        const paypalTransList = await User.find(data);
        // console.log(paypalTransList, "Paypal trans list")

        // let transporter = nodemailer.createTransport({
        //     host: config.SMTP_EMAIL_SERVICE,
        //     port: 587,
        //     // secure: true, // upgrade later with STARTTLS
        //     auth: {
        //         user: config.SMTP_EMAIL_ID,
        //         pass: config.SMTP_EMAIL_PWD,
        //     },
        // })
        pathToAttachment = __dirname + config.MAIL_LOGO;
        attachment = fs.readFileSync(pathToAttachment).toString("base64");
        //console.log(attachment)
        //return
        sgMail.setApiKey(process.env.Sendgrid_APIKey)

        paypalTransList.forEach(async (elem) => {
            // console.log(elem, elem._id, elem?.paypal_ID, 'users for paypal')
            let headers = {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(`${config.PAYPAL_CLIENT_ID}:${config.PAYPAL_CLIENT_SECRET_KEY}`)
            }
            if (elem?.paypal_ID && elem?.all_subscription_details[0]?.type == "Monthly") {
                // ! monthly
                await fetch(`${config.PAYPAL_API}billing/subscriptions/${elem?.paypal_ID}/transactions?start_time=2018-01-21T07:50:20.940Z&end_time=2030-12-31T07:50:20.940Z`, {
                    method: 'GET',
                    headers: headers,
                }).then((res) => {
                    // // console.log('res', res)
                    return res.json()
                }).then(async (json) => {
                    // console.log('json: ', json, json?.transactions[0]?.time, new Date(json?.transactions[0]?.time).getTime())
                    if (new Date(json?.transactions[0]?.time).getTime() > new Date(date.getTime() - 60 * 60 * 24 * 1000).getTime()) {
                        let new_date = new Date(json?.transactions[0]?.time)
                        let end_date = new Date(new_date.setMonth(new_date.getMonth() + 1))
                        // let end_date = new Date(new Date(json?.transactions[0]?.time).getTime() + 60 * 60 * 24 * 1000)
                        // console.log('correct', new Date(json?.transactions[0]?.time).getTime(), new Date(date.getTime() - 60 * 60 * 24 * 1000).getTime(), end_date)
                        let addOrder = {
                            subscription_id: elem?.subscription_details?._id,
                            end_date: end_date,
                            start_date: json?.transactions[0]?.time,
                            status: true,
                            name: elem?.subscription_details?.name,
                            price: elem?.subscription_details?.price,
                            country: elem?.subscription_details?.country,
                            type: elem?.subscription_details?.type,
                        }
                        let updateUser = await User.findOneAndUpdate({
                            _id: elem._id
                        }, {
                            $set: {
                                'subscription_details.end_date': end_date,
                                'subscription_details.start_date': json?.transactions[0].time,
                                'subscription_details.status': true,
                            },
                            $push: {
                                all_subscription_details: addOrder
                            },
                        });
                        if (!updateUser) {
                            // console.log("error")
                        }
                        const mailOptions = {
                            from: `"ARTI" <${config.SMTP_EMAIL_ID}>`,
                            to: elem.email,
                            subject: `Your ARTI Account is renewed successfully.`,
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
                                        <b>Hi ${elem.first_name},</b>
                                    </td>
                                    </tr>
                                    <tr>
                                    <td>
                                        <p style="text-align: left">
                                        Your ARTI Account has been renewed successfully. 
                                        </p>
                                    </td>
                                    </tr>
                                    <tr>
                                    <td>
                                        <br />
                                        <p style="text-align: left">
                                        Please find here the details of your current subscription plan.
                                        </p>
                                    </td>
                                    </tr>
                                    <tr>
                                    <td>
                                        <br />
                                        <h4>Current Plan Details:</h4>
                                    </td>
                                    </tr>
                                    <tr>
                                    <td>
                                        <table>
                                        <tbody>
                                            <tr>
                                            <td style="text-align: left; padding: 5px">Name:</td>
                                            <td style="text-align: left; padding: 5px">
                                                ${elem.subscription_details.name}
                                            </td>
                                            </tr>
                                            <tr>
                                            <td style="text-align: left; padding: 5px">Plan Type:</td>
                                            <td style="text-align: left; padding: 5px">
                                                ${elem.subscription_details.type}
                                            </td>
                                            </tr>
                                            <tr>
                                            <td style="text-align: left; padding: 5px">Price:</td>
                                            <td style="text-align: left; padding: 5px">
                                                ${elem.subscription_details.price}
                                            </td>
                                            </tr>
                                            <tr>
                                            <td style="text-align: left; padding: 5px">
                                                Subscription Ending:
                                            </td>
                                            <td style="text-align: left; padding: 5px">
                                                ${elem.subscription_details.start_date}
                                            </td>
                                            </tr>
                                            <tr>
                                            <td style="text-align: left; padding: 5px">
                                                Next Billing Date:
                                            </td>
                                            <td style="text-align: left; padding: 5px">
                                                ${elem.subscription_details.end_date}
                                            </td>
                                            </tr>
                                        </tbody>
                                        </table>
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
                        // transporter.sendMail(mailOptions, (error, info) => {
                        //     if (error) {
                        //         // console.log(error);
                        //     } else {
                        //         // console.log(info, 'Transaction success');
                        //         // res.send({ email: email })
                        //     }
                        // })
                    } else {
                        // console.log('incorrect')
                    }
                }).catch((err) => {
                    // console.log("error: ", err)
                })
            } else if (elem?.paypal_ID && elem?.all_subscription_details[0]?.type == "Yearly") {
                // ! yearly
                await fetch(`${config.PAYPAL_API}billing/subscriptions/${elem?.paypal_ID}/transactions?start_time=2018-01-21T07:50:20.940Z&end_time=2030-12-31T07:50:20.940Z`, {
                    method: 'GET',
                    headers: headers,
                }).then((res) => {
                    // // console.log('res', res)
                    return res.json()
                }).then(async (json) => {
                    // console.log('json: ', json, json?.transactions[0]?.time, new Date(json?.transactions[0]?.time).getTime())
                    if (new Date(json?.transactions[0]?.time).getTime() > new Date(date.getTime() - 60 * 60 * 24 * 1000).getTime()) {
                        let new_date = new Date(json?.transactions[0]?.time)
                        let end_date = new Date(new_date.setFullYear(new_date.getFullYear() + 1))
                        // let end_date = new Date(new Date(json?.transactions[0]?.time).getTime() + 60 * 60 * 24 * 1000 * 12)
                        // console.log('correct', new Date(json?.transactions[0]?.time).getTime(), new Date(date.getTime() - 60 * 60 * 24 * 1000).getTime(), end_date)
                        let addOrder = {
                            subscription_id: elem?.subscription_details?._id,
                            end_date: end_date,
                            start_date: json?.transactions[0]?.time,
                            status: true,
                            name: elem?.subscription_details?.name,
                            price: elem?.subscription_details?.price,
                            country: elem?.subscription_details?.country,
                            type: elem?.subscription_details?.type,
                        }
                        let updateUser = await User.findOneAndUpdate({
                            _id: elem._id
                        }, {
                            $set: {
                                'subscription_details.end_date': end_date,
                                'subscription_details.start_date': json?.transactions[0].time,
                                'subscription_details.status': true,
                            },
                            $push: {
                                all_subscription_details: addOrder
                            },
                        });
                        if (!updateUser) {
                            // console.log("error")
                        }
                        const mailOptions = {
                            from: `"ARTI" <${config.SMTP_EMAIL_ID}>`,
                            to: elem.email,
                            subject: `Your ARTI Account is renewed successfully.`,
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
                                        <b>Hi ${elem.first_name},</b>
                                    </td>
                                    </tr>
                                    <tr>
                                    <td>
                                        <p style="text-align: left">
                                        Your ARTI Account has been renewed successfully. 
                                        </p>
                                    </td>
                                    </tr>
                                    <tr>
                                    <td>
                                        <br />
                                        <p style="text-align: left">
                                        Please find here the details of your current subscription plan.
                                        </p>
                                    </td>
                                    </tr>
                                    <tr>
                                    <td>
                                        <br />
                                        <h4>Current Plan Details:</h4>
                                    </td>
                                    </tr>
                                    <tr>
                                    <td>
                                        <table>
                                        <tbody>
                                            <tr>
                                            <td style="text-align: left; padding: 5px">Name:</td>
                                            <td style="text-align: left; padding: 5px">
                                                ${elem.subscription_details.name}
                                            </td>
                                            </tr>
                                            <tr>
                                            <td style="text-align: left; padding: 5px">Plan Type:</td>
                                            <td style="text-align: left; padding: 5px">
                                                ${elem.subscription_details.type}
                                            </td>
                                            </tr>
                                            <tr>
                                            <td style="text-align: left; padding: 5px">Price:</td>
                                            <td style="text-align: left; padding: 5px">
                                                ${elem.subscription_details.price}
                                            </td>
                                            </tr>
                                            <tr>
                                            <td style="text-align: left; padding: 5px">
                                                Subscription Ending:
                                            </td>
                                            <td style="text-align: left; padding: 5px">
                                                ${elem.subscription_details.start_date}
                                            </td>
                                            </tr>
                                            <tr>
                                            <td style="text-align: left; padding: 5px">
                                                Next Billing Date:
                                            </td>
                                            <td style="text-align: left; padding: 5px">
                                                ${elem.subscription_details.end_date}
                                            </td>
                                            </tr>
                                        </tbody>
                                        </table>
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

                        // transporter.sendMail(mailOptions, (error, info) => {
                        //     if (error) {
                        //         // console.log(error);
                        //     } else {
                        //         // console.log(info, 'Transaction success');
                        //         // res.send({ email: email })
                        //     }
                        // })
                    } else {
                        // console.log('incorrect')
                    }
                }).catch((err) => {
                    // console.log("error: ", err)
                })
            }
        })

    } catch (e) {
        // console.log(e)
    }
}

exports.afterAccountCreation = async () => {
    // console.log("TESTING ACCOUNT CREATION", config.MAIL_LOGO)
    // var reader = new FileReader();
    // reader.readAsDataURL(config.MAIL_LOGO)
    // reader.onload = (_event) => {
    //     // console.log(reader.result)
    // }
    try {
        let date = new Date();
        let data = {
            'role': 'dentist',
            'subscription_details.end_date': { '$lte': new Date(date.getTime()) }
        }

        const paypalTransList = await User.find(data);
        // // console.log(paypalTransList)
    } catch (e) {
        // console.log(e)
    }
}