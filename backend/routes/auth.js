const express = require('express')
const router = express.Router()
const { register, login, registerStud} = require('../controller/auth')


router.route('/register').post(register)
router.route('/login').post(login)

// router.route('/register/stud').post(registerStud)

module.exports = router