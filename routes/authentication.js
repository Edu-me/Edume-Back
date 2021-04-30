const controller = require('../controllers/authentication')
const express = require('express');
const router = express.Router();
const validate = require('../middlewares/validate')
const { validateStudent } = require('../models/student')

router.post('/signup/student', validate(validateStudent), controller.studentSignUp)
router.get('/confirm', controller.verifyStudent)
module.exports = router