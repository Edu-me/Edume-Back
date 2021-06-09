const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate')
const auth = require('../middlewares/authentication')
const controller = require('../controllers/tutor')
const tutor = require('../middlewares/tutor')
const Joi = require('joi');

router.put('/me/info',[auth,tutor,validate(validateTutorInfo)],controller.updateTutorInfo)
router.put('/me/availability',[auth,tutor,validate(validateTutorAvailability)],controller.updateAvailability)

function validateTutorInfo(body) {
    const schema= Joi.object({
        name: Joi.string()
        .alphanum()
        .required()
        .min(3)
        .max(15),
        phoneNumber: Joi.string()
        .length(11)
        .required()
        .pattern(new RegExp('^[0]{1}[1]{1}([0-2]|[5]){1}[0-9]{8}')).messages({ 'string.pattern.base': 'Please enter a valid phone number' }),
        about: Joi.string()
    })
    return schema.validate(body)
}

function validateTutorAvailability(body){
    const schema = Joi.array().items(Joi.boolean()).min(7)
    return schema.validate(body)
}

module.exports= router