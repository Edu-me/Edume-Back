
const mongoose = require('mongoose');
const _ = require('lodash')
const { Request } = require('../models/serviceRequest');
const { Service } = require('../models/service');
const { TutorService } = require('../models/tutorService');
const { Tutor } = require('../models/tutor');
const { Student } = require('../models/student');


exports.sendRequest = async (req, res) => {
    let tutorService = await TutorService.findOne({ tutor: req.body.tutor, service: req.body.service, mode: req.body.sessionType })
    if (!tutorService) return res.status(404).send("can't find this tutor with the requiered service")
    let request = await Request.findOne({ tutor: req.body.tutor, service: req.body.service, student: req.body.student })
    if (request) {
        if (request.status == "pending") return res.status(400).send("You have already requested this tutor of the same service, the request is still in pending state")
    }
    request = new Request(req.body)
    await request.save()
    request.service = await Service.findById(tutorService.service)
        .populate('subject', 'subject -_id')
        .populate('level', 'level -_id')
        .populate('systemLanguage', 'language -_id')
    request.tutor = await Tutor.findById(request.tutor).select('-password -__V')
    request.student = await Student.findById(request.student).select('-password -__V -isVerified -confirmationToken')
    return res.send(request)
}

exports.toggleRequestStatus = async(req,res)=>{
    let request = await Request.findById(req.params.id)
    if(!request) return res.status(404).send("Can't find a request with this ID")
    request.status = req.body.status
    await request.save()
    return res.send("This request status is updated successfully")
}

exports.updateRequestDetails = async(req,res)=>{
    let request = await Request.findById(req.params.id)
    if(!request) return res.status(404).send("Can't find a request with this ID")
    request.sessionType = req.body.sessionType
    request.sessionDuration = req.body.sessionDuration
    request.day = req.body.day
    request.message = req.body.message
    await request.save()
    return res.send("This request is updated successfully")
}
