const cron = require('node-cron');
const cronHelper = require('../middleware/cron-helper');
const moment = require('moment');
const moments = require('moment-timezone');

exports.cronJob = () => {
    let _cronStartTime = moments(Date.now()).tz("Asia/Kolkata").format("DD/MM/YYYY h:mm:ss A")

    // console.log('cronjob start at ...' + _cronStartTime);
    
    // every 2min
    // cron.schedule('*/1 * * * *', cronHelper.sendRenewalEmail);
    // Everyday 11AM 

    // daily activity email
    cron.schedule('0 0 21 * * *', cronHelper.sendDailyReminder);
    // cron.schedule('*/2 * * * * ', cronHelper.sendDailyReminder);

    // reminder for pending subscription
    cron.schedule('0 0 22 * * *', cronHelper.sendReminderForPendingSubs);
    // cron.schedule('*/2 * * * * ', cronHelper.sendReminderForPendingSubs);

    // renewal email
    cron.schedule('0 0 22 * * *', cronHelper.sendRenewalEmail);
    // cron.schedule('*/2 * * * * ', cronHelper.sendRenewalEmail);
    
    // renewal email
    cron.schedule('0 0 22 * * *', cronHelper.beforeRecurringPayment);
    // cron.schedule('*/2 * * * * ', cronHelper.sendRenewalEmail);

    // cron.schedule('0 22 * * * 0', cronHelper.paypalTransaction);
    cron.schedule('*/15 * * * * ', cronHelper.paypalTransaction);
    
    // after account creation
    cron.schedule('*/1 * * * * ', cronHelper.afterAccountCreation);
}

// ┌────────────── every second (optional) 0-59
// │ ┌──────────── every minute 0-59
// │ │ ┌────────── every hour 0-23
// │ │ │ ┌──────── every day of month 1-31
// │ │ │ │ ┌────── every month 1-12 (or names)
// │ │ │ │ │ ┌──── every day of week 0-7 (or names, 0 or 7 are sunday)
// │ │ │ │ │ │
// │ │ │ │ │ │
// * * * * * *