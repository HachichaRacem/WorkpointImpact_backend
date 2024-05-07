const express = require("express");
const router = express.Router();
const destinationController = require("../controllers/Destination");

router.get("/", destinationController.getAllDestinations);
router.post("/", destinationController.createDestination);
router.put("/update/:id",destinationController.updateDestination);
module.exports = router;