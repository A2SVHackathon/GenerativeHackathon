const express = require("express");
const router  = express.Router();
const { getSitePhoto } = require('../controller/photo')

router.use(express.urlencoded({ extended: true }));


router.route('/getPhoto').post(getSitePhoto)

module.exports = router;