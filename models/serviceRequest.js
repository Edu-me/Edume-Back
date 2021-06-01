const mongoose = require('mongoose');
const validator = require('validator');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
let requestSchema = new mongoose.Schema({
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
    },
    sessionType: {
        type: String,
        required: true,
        enum: {
            values: ["online", "offline"],
            message: '{VALUE} is not a supported mode'
        },
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
    day: {
        type: String,
        required: true,
        enum: {
            values: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            message: '{VALUE} is not a valid day'
        },
    },
    message: {
        type: String,
        required: false,
        default: "",
        maxlength: 400
    },
    status: {
        type: String,
        required: false,
        default: "pending",
        enum: {
            values: ["pending", "refused", "accepted"],
            message: '{VALUE} is not a valid status'
        }
    }
})

const Request = mongoose.model('service-requests', requestSchema);

function validateRequest(request) {
    const schema = Joi.object({
        tutor: Joi.objectId().required(),
        student: Joi.objectId().required(),
        service: Joi.objectId().required(),
        sessionType: Joi.string().valid("online", "offline").required(),
        sessionDuration: Joi.number().min(1).max(3).required(),
        studentsNum: Joi.number().min(1).max(5).required(),
        day: Joi.string().valid("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday").required(),
        message: Joi.string().max(400),
    });
    return schema.validate(request)
}

exports.validateRequest = validateRequest
exports.Request = Request
