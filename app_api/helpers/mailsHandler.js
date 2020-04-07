const nodemailer = require ("nodemailer");


const smtptransporter = nodemailer.createTransport ({
service : 'gmail',
auth : {
    type : 'OAuth2',
    clientId : process.env.CLIENT_ID,
    clientSecret : process.env.CLIENT_SECRET,
    },
tls: {
    rejectUnauthorized: false
}
});
module.exports = {
    smtptransporter : smtptransporter
}