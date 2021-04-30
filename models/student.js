const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const {JoiPasswordComplexity} = require('joi-password')
require('dotenv').config()
const Joi = require('joi');
const phoneNumberValidator = Joi.extend(require('joi-phone-number'))

let studentSchema = new mongoose.Schema({
email:{
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate :[validator.isEmail, 'Please enter a valid email']
},
password:{
    type: String,
    required: true,
    minlength: 8,
    maxlength: 1024
},
phoneNumber:{
    type: String,
    required: true,
    validate :[validator.isMobilePhone, 'Please enter a valid phone number'],
    trim: true,
},
name:{
    type: String,
    required: true,
    minlength: 3,
    maxlength: 15,
},
isVerified:{
    type: Boolean,
    required: true,
    default : false
}
})

studentSchema.methods.generateAuthToken=function(){
    const token = jwt.sign({ _id: this._id, role: "student" , email:this.email},process.env.JWT_PRIVATE_KEY);
    return token;
}

const Student = mongoose.model('student', studentSchema);

function validateStudent(student){
    const schema = Joi.object({
        email: Joi.string().email({minDomainSegments: 2, tlds: { allow: ['com', 'net'] }}).required(),
        name: Joi.string().alphanum().required().min(3).max(15),
        password:JoiPasswordComplexity.string().minOfSpecialCharacters(2).minOfLowercase(2).minOfUppercase(2).minOfNumeric(2).required(),
        confirmPassword : Joi.string().required().equal(Joi.ref('password')).messages({ 'any.only': 'confirmed password does not match password' }),
        phoneNumber : Joi.string().length(11).required().pattern(new RegExp('^[0]{1}[1]{1}([0-2]|[5]){1}[0-9]{8}')).messages({'string.pattern.base':'Please enter a valid phone number'})
      });
      return schema.validate(student) 
}

exports.validateStudent= validateStudent
exports.Student= Student

