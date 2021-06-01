const { result } = require('lodash');
const mongoose = require('mongoose');
const { Service } = require('../models/service');
const { TutorService } = require('../models/tutorService');
const {Tutor} = require('../models/tutor')
exports.getSystemServices = async (req, res) => {
    let services = await Service.find()
        .populate('subject', 'subject -_id')
        .populate('level', 'level -_id')
        .populate('systemLanguage', 'language -_id')
        .select("-__v")
    return res.send(services)
}


exports.getServiceTutorsOnline = async (req, res) => {
    let check= await Service.findOne({_id:req.params.id})
    if(!check) return res.status(404).send("There is no service with this Id")
    let result=await TutorService.find({ service: req.params.id, mode:'online', availability: true })
        .populate('tutor','name phoneNumber nationality').select('locations rating tutor -_id')
    if(result.length==0) return res.status(404).send("Sorry, no tutors found for this service")
    return res.send(result)
}

exports.getServiceTutorsOffline = async (req, res) => {
    let check= await Service.findOne({_id:req.params.id})
    if(!check) return res.status(404).send("There is no service with this Id")
    let result=await TutorService.find({ service: req.params.id, mode:'offline', availability: true })
        .populate('tutor','name phoneNumber nationality').select('locations rating tutor -_id')
    if(result.length==0) return res.status(404).send("Sorry, no tutors found for this service")
    return res.send(result)
}


exports.getTutor = async (req,res)=>{
    let tutor = await Tutor.findOne({ _id: req.params.id }).select('-password -__v')
    if(!tutor) return res.status(404).send("No such tutor with this ID")
    return res.send(tutor)
}