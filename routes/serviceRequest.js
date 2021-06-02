const express = require('express');
const router = express.Router();
const controller = require('../controllers/serviceRequest')
const validate = require('../middlewares/validate')
const student = require('../middlewares/student')
const auth = require('../middlewares/authentication')
const tutor = require('../middlewares/tutor')
const {validateRequest} = require('../models/serviceRequest')
const Joi = require('joi');


router.post('/',[auth,student,validate(validateRequest)],controller.sendRequest)
router.put('/status/:id',[auth,tutor, validate(validateRequestToggle)],controller.toggleRequestStatus)
router.get('/tutor',[auth,tutor],controller.getTutorRequests)
router.get('/student',[auth,student],controller.getStudentRequests)
router.put('/details/:id',[auth,student,validate(validateRequestEdit)],controller.updateRequestDetails)
router.delete('/:id',[auth,student],controller.deleteRequest)

function validateRequestEdit(body){
    const schema = Joi.object({
        sessionDuration: Joi.number().min(1).max(3).required(),
        studentsNum: Joi.number().min(1).max(5).required(),
        day: Joi.string().valid("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday").required(),
        message: Joi.string().max(400),
    });
    return schema.validate(body)
}

function validateRequestToggle(body){
    const schema = Joi.object({
        status: Joi.valid("pending", "refused", "accepted").required()
    });
    return schema.validate(body)
}

module.exports = router