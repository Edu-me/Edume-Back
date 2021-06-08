const mongoose = require('mongoose');
const { Student } = require('../models/student');
const _ = require('lodash')

exports.getStudent= async(req,res)=>{
    let student=await Student.findById(req.params.id);
    if(!student) return res.status(404).send('No tutor found with this ID')
    else return res.send(_.pick(student,['email','phoneNumber','name','_id']))
}

exports.updateStudent= async (req,res)=>{
    await Student.findByIdAndUpdate(req.user._id,{
        $set:{
            phoneNumber : req.body.phoneNumber,
            name: req.body.name
        }
    })
    return res.send('your info has been updated successfully!')
} 