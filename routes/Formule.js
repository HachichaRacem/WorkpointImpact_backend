const express = require("express");
const formule = require("../controllers/Formule");
const router = express.Router();

router.get("/",formule.getAllFormule);
router.post("/",formule.createformule);
module.exports = router;
