const express = require('express');
const router = express.Router();
const controller = require('../controllers/session')
const validate = require('../middlewares/validate')
const student = require('../middlewares/student')
const auth = require('../middlewares/authentication')
const tutor = require('../middlewares/tutor')
const {validateOnlineSession} = require('../models/onlineSession')
const Joi = require('joi');


router.post('/online',[auth,tutor,validate(validateOnlineSession)],controller.submitOnlineSession)


module.exports = router