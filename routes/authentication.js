const controller = require('../controllers/authentication')
const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate')
const { validateStudent } = require('../models/student')
const Joi = require('joi');
const { JoiPasswordComplexity } = require('joi-password')



router.post('/signup/student', validate(validateStudent), controller.studentSignUp)
router.get('/confirm',controller.verifyStudent)
router.post('/login',validate(validateLogin), controller.login)

function validateLogin(loginReqBody) {
    const schema = Joi.object({
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .required(),
        password: JoiPasswordComplexity.string()
            .minOfSpecialCharacters(2)
            .minOfLowercase(2)
            .minOfUppercase(2)
            .minOfNumeric(2)
            .required(),
    });
    return schema.validate(loginReqBody)
}

module.exports = router