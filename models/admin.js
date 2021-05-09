const mongoose = require('mongoose');
const validator = require('validator');
require('dotenv').config()
const jwt = require('jsonwebtoken');
const generateToken = require('../utils/generateToken')

let adminSchema = new mongoose.Schema({
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
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 15,
    },

})

adminSchema.methods.generateAuthToken = generateToken({ _id: this._id, role: "admin", email: this.email },process.env.JWT_PRIVATE_KEY)

const Admin=mongoose.model('admin', adminSchema);
exports.Admin = Admin

