const mongoose = require('mongoose');
const Joi = require('joi');
let locations=["Giza","Cairo","Alexandria","Luxor","Aswan","Faiyum","Ismailia","Minya"]
let tutorServiceSchema = new mongoose.Schema({
    tutor: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'tutor',
        required: true
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'service',
        required: true
    },
    availability: {
        type: Boolean,
        required: true,
        default : true
    },
    rating : {
        type: Number,
        min: 0,
        max: 5,
        required : true,
        default: 5
    },
    locations : {
        type: [String],
        required: true,
        enum:{
            values: locations,
            message: '{VALUE} is not a supported location'
        },
        validate : {
            validator : function (arr) {
                return arr.length > 0
            },
            message: "You must provide at least 1 location"
        }
    }
})

tutorServiceSchema.index({tutor:1, service:1}, {unique:true})
const TutorService = mongoose.model('tutor-services',tutorServiceSchema)
exports.TutorService = TutorService
