const mongoose = require('mongoose');
const { Tutor } = require('../models/tutor');

exports.updateTutorInfo = async (req, res) => {
    let tutor = await Tutor.findById(req.user._id)
    if (!tutor) return res.status(404).send('cannot find a tutor with this ID')
    tutor.name = req.body.name
    tutor.phoneNumber = req.body.phoneNumber
    if (req.body.about != null) {
        tutor.about = req.body.about
    }
    await tutor.save()
    return res.send('your info has been updated sucessfully')
}

exports.updateAvailability = async (req, res) => {
    let tutor = await Tutor.findById(req.user._id)
    console.log(tutor.availability)
    if (!tutor) return res.status(404).send('cannot find a tutor with this ID')
    for(i=0;i<7;i++){
        tutor.availability[i].availabe=req.body[i]
    }
    await tutor.save()
    return res.send('your availability has been updated sucessfully')
}