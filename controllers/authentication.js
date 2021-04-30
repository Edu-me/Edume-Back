const mongoose = require('mongoose');
const { Student } = require('../models/student')
const bcrypt = require('bcrypt');
const _ = require('lodash');
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken');
const { options, sendConfirmationEmail } = require('../utils/email')

const baseApiURl = `${process.env.API_BASE_URL}/v${process.env.API_VERSION}`

exports.studentSignUp = async (req, res) => {
    let student = await Student.findOne({ email: req.body.email })
    if (student) {
        return res.status(400).send("This email has registered before")
    }
    student = new Student(_.pick(req.body, ['email', 'password', 'phoneNumber', 'name']))
    const salt = await bcrypt.genSalt(10);
    student.password = await bcrypt.hash(student.password, salt);
    student.confirmationToken = student.generateConfirmationToken()
    options.subject = "Please confirm your Email"
    options.html = `<h1>Email Confirmation</h1>
    <h2>Hello ${student.name}</h2>
    <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
    <a href=http://localhost:3000${baseApiURl}/auth/confirm?confirmationToken=${student.confirmationToken}> Click here</a>
    <p>Note that this link will expire after 3 days from the date of sending this email.</p>
    </div>`
    await sendConfirmationEmail(student.email)
    await student.save()
    res.send(_.pick(student, ['name', 'email', 'phoneNumber']))
    return
}

exports.verifyStudent = async (req, res) => {
    let decoded;
    try {
        decoded = jwt.verify(req.query.confirmationToken, process.env.CONFIRMATION_TOKEN_PRIVATE_KEY)
    }
    catch (err) {
        throw new Error(err.message)
    }
    let student = await Student.findOne({ email: decoded.email })
    if (student) {
        student.isVerified = true
        await student.save()
        return res.status(200).send("This Student is now verfied")
    }
    else {
        return res.status(404).send("Student is not found")
    }
}