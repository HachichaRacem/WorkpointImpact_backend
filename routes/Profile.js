const express = require("express");
const profile = require("../controllers/Profile");
const router = express.Router();

router.get("/",profile.getAllProfile);
router.post("/",profile.createProfile);
module.exports = router;