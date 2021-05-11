
require('dotenv').config()
const express = require('express');
const auth = require('../routes/authentication')
const admin_get = require('../routes/admin_routes/admin_tutors')
const baseApiURl = `${process.env.API_BASE_URL}/v${process.env.API_VERSION}`
const error = require('../middlewares/error')
module.exports = (app) => {
    app.use(express.json());
    app.use(`${baseApiURl}/auth`, auth)
    app.use(`${baseApiURl}/admin`, admin_get)
    app.use(error)
}