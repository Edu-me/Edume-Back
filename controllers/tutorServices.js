const { forEach } = require('lodash');
const mongoose = require('mongoose');
const { Service, Subject, Level, SystemLanguage } = require('../models/service');
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
    let tutorServices =await TutorService.find({tutor:req.params.id})
    .populate({path: 'service',populate:{
        path:'subject',
        model: Subject
    }})
    .populate({path:'service',populate:{
        path:'level',
        model:Level
    }})
    .populate({path:'service',populate:{
        path:'systemLanguage',
        model:SystemLanguage
    }}).select("-_id")
    .select("-__v -tutor")

    if(tutorServices.length==0) return res.status(404).send("There is no services for this tutor")
    return res.send(tutorServices)
}

exports.updateServiceLocations = async (req, res) => {
    let tutorService = await TutorService.findById({ _id: req.params.id })
    if (!tutorService) return res.status(404).send("No tutor service found with this id.")
    if (req.user._id != tutorService.tutor) return res.status(403).send("This service doesn't belong to this tutor")
    if (tutorService.mode === "online") return res.status(400).send("you can't add locations to online service")
    tutorService.locations = req.body.locations
    await tutorService.save()
    return res.send("The locations of this service have been updated successfully!")
}

exports.updateServiceAvailability = async (req, res) => {
    let tutorService = await TutorService.findById({ _id: req.params.id })
    if (!tutorService) return res.status(404).send("No tutor service found with this id.")
    if (req.user._id != tutorService.tutor) return res.status(403).send("This service doesn't belong to this tutor")
    tutorService.availability = req.body.availability
    await tutorService.save()
    return res.send("The availability of this service has been updated successfully!")
}

exports.deleteService = async (req, res) => {
    let tutorService = await TutorService.findById({ _id: req.params.id })
    if (!tutorService) return res.status(404).send("No tutor service found with this id.")
    if (req.user._id != tutorService.tutor) return res.status(403).send("This service doesn't belong to this tutor")
    await tutorService.delete()
    return res.send("This service has been deleted successfully")
}
