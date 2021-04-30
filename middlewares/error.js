require('dotenv').config()
errorDebugger = require('debug')('error')

module.exports = (error, req, res, next) => {
    errorDebugger(error.message)
    res.status(500).send('Internal server error. Something failed')
}