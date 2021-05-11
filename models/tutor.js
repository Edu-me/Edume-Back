const mongoose = require('mongoose');
const validator = require('validator');
const { nationalities } = require('../utils/nationality')
const { JoiPasswordComplexity } = require('joi-password')
require('dotenv').config()
const Joi = require('joi');
const generateToken = require('../utils/generateToken')
const jwt = require('jsonwebtoken');

let tutorSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: [validator.isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: true,
        minlength: 9,
        maxlength: 1024
    },
    phoneNumber: {
        type: String,
        required: true,
        validate: [validator.isMobilePhone, 'Please enter a valid phone number'],
        trim: true,
    },
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 15,
    },
    nationality: {
        type: String,
        enum: {
            values: nationalities,
            message: '{VALUE} is not supported'
        },
        required: true,
    },
    about: {
        type: String,
        required: false,
        minlength: 20,
    },
    availability:{
        type:
        [
        new mongoose.Schema({
            day:{
                type:"String",
                required:true,
                enum: {
                    values: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                    message: '{VALUE} is not a week day'
                }
            },
            availabe: {
                type: Boolean,
                required: true,
                default: true
            }
        }),
    ],
    required: true,
    default: [{day: "Sunday"},{day: "Monday"},{day: "Tuesday"},{day: "Wednesday"},{day: "Thursday"},{day: "Friday"},{day: "Saturday"}]
}

})

tutorSchema.methods.generateAuthToken = function generateAuthToken() {
    return jwt.sign({ _id: this._id, role: "tutor", email: this.email },process.env.JWT_PRIVATE_KEY);
}

const Tutor = mongoose.model('tutor', tutorSchema);

function validateTutor(tutor) {
    const schema = Joi.object({
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .required(),
        name: Joi.string()
            .alphanum()
            .required()
            .min(3)
            .max(15),
        password: JoiPasswordComplexity.string()
            .min(9)
            .minOfSpecialCharacters(1)
            .minOfLowercase(1)
            .minOfUppercase(1)
            .minOfNumeric(1)
            .required(),
        confirmPassword: Joi.string()
            .required()
            .equal(Joi.ref('password'))
            .messages({ 'any.only': 'confirmed password does not match password' }),
        phoneNumber: Joi.string()
            .length(11)
            .required()
            .pattern(new RegExp('^[0]{1}[1]{1}([0-2]|[5]){1}[0-9]{8}')).messages({ 'string.pattern.base': 'Please enter a valid phone number' }),
        nationality: Joi.string()
            .required(),
        about: Joi.string()
            .min(20)
    });
    return schema.validate(tutor)
}

exports.validateTutor = validateTutor
exports.Tutor = Tutor

