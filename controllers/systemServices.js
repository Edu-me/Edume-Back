const { result } = require('lodash');
const mongoose = require('mongoose');
const { Service } = require('../models/service');
const { TutorService } = require('../models/tutorService');

exports.getSystemServices = async (req, res) => {
    let services = await Service.find()
        .populate('subject', 'subject -_id')
        .populate('level', 'level -_id')
        .populate('systemLanguage', 'language -_id')
        .select("-__v")
    return res.send(services)
}


exports.getServiceTutors = async (req, res) => {
    let check= await Service.findOne({_id:req.body.service})
    if(!check) return res.status(404).send("There is no service with this Id")
    let result=await TutorService.find({ service: req.body.service, mode: req.body.mode, availability: true })
        .populate('tutor','name phoneNumber nationality').select('locations rating tutor -_id')
    if(result.length==0) return res.status(404).send("Sorry, no tutors found for this service")
    return res.send(result)
}

exports.getTutor = async (req,res)=>{
    let tutor = await Tutor.findOne({ _id: req.params.id }).select('-password -__v')
    if(!tutor) return res.status(404).send("No such tutor with this ID")
    return res.send(tutor)
}