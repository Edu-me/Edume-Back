const mongoose = require('mongoose');
const { Service } = require('../models/service');
const { Tutor } = require('../models/tutor');
const { TutorService } = require('../models/tutorService');

exports.getSystemServices = async (req, res) => {
    let services = await Service.find()
        .populate('subject', 'subject -_id')
        .populate('level', 'level -_id')
        .populate('systemLanguage', 'language -_id')
        .select("-__v")
    return res.send(services)
}

exports.addTutorService = async (req, res) => {

    let tutor = await Tutor.findById(req.body.tutor)
    if (!tutor) return res.status(404).send("No tutor with the given id")
    let service = await Service.findById(req.body.service)
    if (!service) return res.status(404).send("No service with this id")
    let tutorService = await TutorService.findOne({ tutor: req.body.tutor, service: req.body.service, mode: req.body.mode })
    if (tutorService) return res.status(400).send("This service is already existed")
    tutorService = new TutorService(req.body)
    await tutorService.save()
    tutorService.service = await Service.findById(tutorService.service)
        .populate('subject', 'subject -_id')
        .populate('level', 'level -_id')
        .populate('systemLanguage', 'language -_id')
    return res.send(tutorService.populate('tutor', 'name -_id'))
}

exports.getTutorServices= async (req,res)=>{

}

exports.updateServiceLocations = async(req,res)=>{

}

exports.updateServiceAvailability = async(req,res)=>{

}

exports.deleteService = async (req,res)=>{
    
}
