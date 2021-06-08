
require('dotenv').config()
const express = require('express');
const auth = require('../routes/authentication')
const tutor = require('../routes/tutorServices')
const systemServices = require('../routes/systemServices')
const requests = require('../routes/serviceRequest')
const admin_get = require('../routes/admin_routes/admin_tutors')
const student = require ('../routes/student')
const baseApiURl = `${process.env.API_BASE_URL}/v${process.env.API_VERSION}`
const error = require('../middlewares/error');
module.exports = (app) => {
    app.use(express.json());
    app.use(`${baseApiURl}/auth`, auth)
    app.use(`${baseApiURl}/tutor/services`,tutor)
    app.use(`${baseApiURl}/system/services`,systemServices)
    app.use(`${baseApiURl}/request`,requests)
    app.use(`${baseApiURl}/admin`, admin_get)
    app.use(`${baseApiURl}/student`,student)
    app.use(error)
}