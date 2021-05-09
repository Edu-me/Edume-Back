const mongoose = require('mongoose');
const { Student } = require('../models/student')
const { Admin } = require('../models/admin')
const _ = require('lodash');
const nodemailer = require('nodemailer')
const jwt = require('jsonwebtoken');
const { options, sendConfirmationEmail } = require('../utils/email')
const passwordHashing = require('../utils/passwordHashing')
const bcrypt = require('bcrypt');
const {Tutor} = require('../models/tutor')
const baseApiURl = `${process.env.API_BASE_URL}/v${process.env.API_VERSION}`

exports.studentSignUp = async (req, res) => {
    let student = await Student.findOne({ email: req.body.email })
    if (student) {
        return res.status(400).send("This email has registered before")
    }
    student = new Student(_.pick(req.body, ['email', 'password', 'phoneNumber', 'name']))
    student.password= await passwordHashing(student.password)
    student.confirmationToken = student.generateConfirmationToken()
    setEmailOptions(student)
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

exports.tutorSignup = async(req,res)=>{
    let tutor= await Tutor.findOne({email:req.body.email})
    if(tutor){
        return res.status(400).send("This email has registered before")
    }
    tutor = new Tutor(_.pick(req.body,['email','name','password','phoneNumber','nationality','about']))
    tutor.password= await passwordHashing(tutor.password)
    await tutor.save()
    return res.send(_.pick(tutor,['email','name','phoneNumber']))
}

exports.login = async (req,res)=>{
    let role = req.query.role
    if(role==="student"){
        let student = await Student.findOne({ email: req.body.email })
        if(!student) return res.status(404).send("This email wasn't registered before, Please signup first")
        const validPassword = await bcrypt.compare(req.body.password, student.password);
        if (!validPassword) return res.status(400).send('Invalid email or password.');
        if(student.isVerified==false){
            try {
                let decoded = jwt.verify(student.confirmationToken, process.env.CONFIRMATION_TOKEN_PRIVATE_KEY)
                return res.status(400).send("This email isn't verified yet, Pleas check your inbox to verify")
            }
            catch (err) {
                res.status(400).send("Please verify your email, we will send another verification code as the previous one is expired. Check your inbox!")
                student.confirmationToken = student.generateConfirmationToken()
                setEmailOptions(student)
                await sendConfirmationEmail(student.email)
                await student.save()
            }
        }
        else{
        const token = student.generateAuthToken()
        require('dotenv').config()
        return res.header('x-auth-token',token).send(_.pick(student,['_id','email','name','phoneNumber']))
        }
    }
    else if (role==="tutor"){
        let tutor = await Tutor.findOne({ email: req.body.email })
        if(!tutor) return res.status(404).send("This email wasn't registered before, Please signup first")
        const validPassword = await bcrypt.compare(req.body.password, tutor.password);
        if (!validPassword) return res.status(400).send('Invalid email or password.');
        const token = tutor.generateAuthToken()
        return res.header('x-auth-token',token).send(_.pick(tutor,['_id','email','name','phoneNumber']))
    }
    else if(role==="admin"){
        let admin = await Admin.findOne({ email: req.body.email })
        if(!admin) return res.status(404).send("This email wasn't registered before, Please signup first")
        const validPassword = await bcrypt.compare(req.body.password, admin.password);
        if (!validPassword) return res.status(400).send('Invalid email or password.');
        const token = admin.generateAuthToken()
        return res.header('x-auth-token',token).send(_.pick(admin,['_id','email','name']))

    }
    else{
        return res.status(400).send("The given role isn't allowed, please send one of those roles [student,tutor,admin]")
    }
}

function setEmailOptions(student) {
    options.subject = "Please confirm your Email"
    options.html = `<h1>Email Confirmation</h1>
    <h2>Hello ${student.name}</h2>
    <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
    <a href=http://localhost:3000${baseApiURl}/auth/confirm?confirmationToken=${student.confirmationToken}> Click here</a>
    <p>Note that this link will expire after 3 days from the date of sending this email.</p>
    </div>`
    
}