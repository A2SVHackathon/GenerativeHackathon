const express = require('express')
const router = express.Router()
const { askByText, askByVoice } = require('../controller/assistant')

router.route('/text').post(askByText)
router.route('/voice').post(askByVoice)

module.exports = router