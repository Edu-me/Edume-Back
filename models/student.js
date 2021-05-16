const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const { JoiPasswordComplexity } = require('joi-password')
require('dotenv').config()
const Joi = require('joi');
const generateToken = require('../utils/generateToken')
const phoneNumberValidator = Joi.extend(require('joi-phone-number'))

let studentSchema = new mongoose.Schema({
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
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    },
    confirmationToken:{
        type: String,
        unique: true,
        required: true
    }

})

studentSchema.methods.generateAuthToken = function generateAuthToken() {
    return jwt.sign({ _id: this._id, role: "student", email: this.email },process.env.JWT_PRIVATE_KEY);
}

studentSchema.methods.generateConfirmationToken = function () {
    const token = jwt.sign({email: this.email }, process.env.CONFIRMATION_TOKEN_PRIVATE_KEY,{expiresIn:'3d'});
    return token;
}



const Student = mongoose.model('student', studentSchema);

function validateStudent(student) {
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
            .pattern(new RegExp('^[0]{1}[1]{1}([0-2]|[5]){1}[0-9]{8}')).messages({ 'string.pattern.base': 'Please enter a valid phone number' })
    });
    return schema.validate(student)
}

exports.validateStudent = validateStudent
exports.Student = Student

