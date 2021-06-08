const Joi = require('joi');
const mongoose = require('mongoose');
require('dotenv').config()

let onlineSessionSchema = new mongoose.Schema({
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
    zoomMeeting:{
        type:String,
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


function validateOnlineSession(onlineSession) {
    const schema = Joi.object({
        student: Joi.objectId().required(),
        service: Joi.objectId().required(),
        sessionDuration: Joi.number().min(60).max(180).required(),
        studentsNum: Joi.number().min(1).max(5).required(),
        day: Joi.string().required().min(2).max(2),
        month : Joi.string().required().min(2).max(2),
        hour : Joi.string().required().min(2).max(2)
    });
    return schema.validate(onlineSession)
}
const OnlineSession=mongoose.model('online-session', onlineSessionSchema);
exports.validateOnlineSession= validateOnlineSession
exports.OnlineSession = OnlineSession
