const express = require('express');
const router = express.Router();
const controller = require('../controllers/tutorServices')
const validate = require('../middlewares/validate')
const Joi = require('joi');
const auth=require('../middlewares/authentication')
const tutor = require('../middlewares/tutor')
const {validateTutorService} = require('../models/tutorService')

router.get('/',controller.getSystemServices)
router.post('/tutorServices',[auth,tutor,validate(validateTutorService)],controller.addTutorService)
router.get('/tutorServices',[auth,tutor],controller.getTutorServices)
router.delete('/tutorServices',[auth,tutor],controller.deleteService)
router.put('/tutorServices/updateLocation',[auth,tutor],controller.updateServiceLocations)
router.put('/tutorServices/updateAvailability',[auth,tutor],controller.updateServiceAvailability)

module.exports= router