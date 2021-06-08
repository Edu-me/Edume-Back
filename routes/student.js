const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate')
const student = require('../middlewares/student')
const auth = require('../middlewares/authentication')
const controller = require('../controllers/student')
const Joi = require('joi');


router.get('/:id', controller.getStudent)
router.put('/me', [auth, student, validate(validateStudentUpdate)], controller.updateStudent)

function validateStudentUpdate(body) {
    const schema = Joi.object({
        phoneNumber: Joi.string()
            .length(11)
            .required()
            .pattern(new RegExp('^[0]{1}[1]{1}([0-2]|[5]){1}[0-9]{8}'))
            .messages({ 'string.pattern.base': 'Please enter a valid phone number' }),
        name: Joi.string()
            .alphanum()
            .required()
            .min(3)
            .max(15)
    });
    return schema.validate(body)
}

module.exports = router