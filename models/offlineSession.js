const Joi = require('joi');
const mongoose = require('mongoose');
require('dotenv').config()

let offlineSessionSchema = new mongoose.Schema({
    sessionTitle : {
        type: String,
        required : true
    },
    day: {
        type:String,
        default: "01",
        required :true
    },
    month :{
        type: String,
        default : "01",
        required : true
    },
    hour : {
        type:String,
        default: "13",
        required: true
    },
    minute: {
        type:String,
        default: "13",
        required: true
    },
    sessionDuration: {
        type: Number,
        required: true,
        min: 1,
        max: 3
    },
    studentsNum: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    location:{
        type: String,
        required: true
    },
    tutor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tutor',
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'student',
        required: true
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'service',
        required: true
    }
})


function validateOfflineSession(offlineSession) {
    const schema = Joi.object({
        student: Joi.objectId().required(),
        service: Joi.objectId().required(),
        sessionDuration: Joi.number().min(60).max(180).required(),
        studentsNum: Joi.number().min(1).max(5).required(),
        day: Joi.string().required().min(2).max(2),
        month : Joi.string().required().min(2).max(2),
        hour : Joi.string().required().min(2).max(2),
        minute: Joi.string().min(2).max(2).required(),
        location: Joi.string().required()
    });
    return schema.validate(offlineSession)
}
const OfflineSession=mongoose.model('offline-session', offlineSessionSchema);
exports.validateOfflineSession= validateOfflineSession
exports.OfflineSession = OfflineSession
