const mongoose = require('mongoose');
const {Student}=require('../models/student')
const bcrypt = require('bcrypt');
const _ = require('lodash');

exports.studentSignUp= async (req,res)=>{
 let student=await Student.findOne({email: req.body.email})
 if(student){
     return res.status(400).send("This email has registered before")
 }
 student = new Student(_.pick(req.body,['email','password','phoneNumber','name']))
 const salt = await bcrypt.genSalt(10);
 student.password = await bcrypt.hash(student.password, salt);
 await student.save()
 return res.send(_.pick(student,['name','email','phoneNumber']))
}