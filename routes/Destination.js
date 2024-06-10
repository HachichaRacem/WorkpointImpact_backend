const express = require("express");
const router = express.Router();
const destinationController = require("../controllers/Destination");
const memberController = require("../controllers/Member");
const authenticateToken = require("../Middleware/auth.middleware");
require('dotenv').config();

router.get("/" ,authenticateToken,destinationController.getAllDestinations);
router.post("/",authenticateToken, destinationController.createDestination);
router.put("/update/:id",authenticateToken,destinationController.updateDestination);
module.exports = router;