const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi)
let modes = ["online", "offline"]
let locations = ["Giza", "Cairo", "Alexandria", "Luxor", "Aswan", "Faiyum", "Ismailia", "Minya"]
let tutorServiceSchema = new mongoose.Schema({
    tutor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tutor',
        required: true
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'service',
        required: true
    },
    availability: {
        type: Boolean,
        required: true,
        default: true
    },
    rating: {
        type: Number,
        min: 0,
        max: 5,
        required: true,
        default: 5
    },
    locations: {
        type: [String],
        required: function () {
            return this.mode === "offline"
        },
        enum: {
            values: locations,
            message: '{VALUE} is not a supported location'
        },
        validate: {
            validator: function (arr) {
                if ((this.mode === "offline" && arr.length <= 0)) {
                    return false
                }
                return true

            },
            message: "You must provide at least 1 location"
        }
    },
    mode: {
        type: String,
        required: true,
        enum: {
            values: modes,
            message: '{VALUE} is not a supported mode'
        }
    }
})

const TutorService = mongoose.model('tutor-services', tutorServiceSchema)

function validateTutorService(tutorService) {
    const schema = Joi.object({
        tutor: Joi.objectId().required(),
        service: Joi.objectId().required(),
        availability: Joi.boolean(),
        rating: Joi.number().min(0).max(5),
        locations: Joi.alternatives().conditional('mode', {
            is: "offline", then:
                Joi.array().min(1).required()
                    .items(Joi.string().valid("Giza", "Cairo", "Alexandria", "Luxor", "Aswan", "Faiyum", "Ismailia", "Minya"))
        }).messages({'alternatives.any':"you should't assign locations to online service"}),
        mode: Joi.string().valid("online", "offline").required()
    });
    return schema.validate(tutorService)
}

exports.TutorService = TutorService
exports.validateTutorService = validateTutorService