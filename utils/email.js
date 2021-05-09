const nodemailer = require('nodemailer')
require('dotenv').config()

let options = {}
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_HOST,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
    }
})

exports.sendConfirmationEmail = async (receiverEmail) => {

    await transporter.sendMail({
        from: "Edume Support",
        to: receiverEmail,
        subject: options.subject,
        text: "",
        html: options.html
    })
}



exports.options = options