const express = require('express');
const router = express.Router();
const controller = require('../controllers/tutorServices')
const validate = require('../middlewares/validate')
const Joi = require('joi');
const auth=require('../middlewares/authentication')
const tutor = require('../middlewares/tutor')
const {validateTutorService} = require('../models/tutorService')

router.post('/',[auth,tutor,validate(validateTutorService)],controller.addTutorService)
router.get('/:id',[auth],controller.getTutorServices)
router.delete('/:id',[auth,tutor],controller.deleteService)
router.put('/updateLocation/:id',[auth,tutor,validate(validateupdateLocations)],controller.updateServiceLocations)
router.put('/updateAvailability/:id',[auth,tutor,validate(validateupdateAvailability)],controller.updateServiceAvailability)


function validateupdateLocations(reqBody) {
    const schema= Joi.object({
        locations : Joi.array()
        .items(Joi.string().valid("Giza","Cairo","Alexandria","Luxor","Aswan","Faiyum","Ismailia","Minya"))
        .min(1)
        .required()
     })
    return schema.validate(reqBody)
}
function validateupdateAvailability(reqBody){
    const schema= Joi.object({
        availability: Joi.boolean().required(),
    })
    return schema.validate(reqBody)
}
module.exports= router