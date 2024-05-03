const express = require("express");
const router = express.Router();
const destinationController = require("../controllers/Destination");

router.get("/", destinationController.getAllDestinations);
router.post("/", destinationController.createDestination);

module.exports = router;
