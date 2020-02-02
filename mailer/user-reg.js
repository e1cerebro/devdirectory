const nodemailer = require("nodemailer");
const { generateToken } = require("../helpers/generate-token")
const config = require('config');

// async..await is not allowed in global scope, must use a wrapper
async function sendmail(user) {

    const host = config.get("url");
    const token = generateToken(user);

    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "tech.nwachukwu16@gmail.com",
            pass: 'DevPro100%'
        }
    });

    let url = host + "/api/users/verify/" + token + "/account";

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Dev Directories" <devdirectories.com>', // sender address
        to: user.email, // list of receivers
        subject: "Account verification", // Subject line
        text: "Click on the following url to verify your account " + url, // plain text body
        html: " Your private token is: <span style='color: red;'>" + token + " </span><p>Click on the following url to verify your account</p> <a href=\" " + url + " \">verify account</a>" // html body
    });

    console.log("Message sent: %s", info.messageId);

}

module.exports = sendmail;
//main().catch(console.error);