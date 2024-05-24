const express = require("express");
const carbonemission = require("../controllers/CarbonEmission.js");
const router = express.Router();
const carbonemissions = require("../services/CarbonEmission.js");



router.get("/",carbonemission.getAllCarboneEmission);
router.post("/",carbonemission.createformule);
router.get("/api/:date",carbonemission.getCarbonEmissionsByDate);
router.get("/download-pdf/:date", carbonemission.generatePDF);
module.exports = router;
