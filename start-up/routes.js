
require('dotenv').config()
const express = require('express');
const auth = require('../routes/authentication')
const services = require('../routes/tutorServices')
const baseApiURl = `${process.env.API_BASE_URL}/v${process.env.API_VERSION}`
const error = require('../middlewares/error')
module.exports = (app) => {
    app.use(express.json());
    app.use(`${baseApiURl}/auth`, auth)
    app.use(`${baseApiURl}/services`,services)
    app.use(error)
}