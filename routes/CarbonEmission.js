const express = require("express");
const carbonemission = require("../controllers/CarbonEmission.js");
const router = express.Router();

router.get("/",carbonemission.getAllCarboneEmission);
router.post("/",carbonemission.createformule);
module.exports = router;
