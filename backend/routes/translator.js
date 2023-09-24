const express = require("express")
const router = express.Router()
const { CreateTranslation } = require("../controller/translator")

router.route("/translate").post(CreateTranslation)

module.exports = router;