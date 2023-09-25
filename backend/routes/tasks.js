const express = require("express");
const router  = express.Router();
const { askAboutSites, createPlan } = require('../controller/task')

router.use(express.urlencoded({ extended: true }));


router.route('/ask').post(askAboutSites)
router.route('/create_plan').post(createPlan)

module.exports = router;