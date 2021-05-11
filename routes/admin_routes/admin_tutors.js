const controller = require('../../controllers/admin_controllers/admin_tutors')
const express = require('express');
const router = express.Router();
const auth=require('../../middlewares/authentication')
const admin = require('../../middlewares/admin')

router.get('/getTutors',[auth,admin], controller.getTutors)
router.delete('/deleteTutor/:id',[auth,admin], controller.deleteTutor)


module.exports = router


