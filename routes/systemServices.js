const express = require('express');
const router = express.Router();
const controller = require('../controllers/systemServices')
const validate = require('../middlewares/validate')
const Joi = require('joi');

router.get('/',controller.getSystemServices)
router.get('/online/tutors/:id',controller.getServiceTutorsOnline)
router.get('/offline/tutors/:id',controller.getServiceTutorsOffline)
router.get('/:id',controller.getTutor)
// function validateServiceRequest(body) {
//     const schema = Joi.object({
//         service: Joi.objectId().required(),
//         mode:Joi.string().valid("online", "offline").required()
//     });
//     return schema.validate(body)
// }
module.exports = router