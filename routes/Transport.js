const express = require("express");
const router = express.Router();
const transportController = require("../controllers/Transport");

router.get("/", transportController.getAllTransports);
router.post("/", transportController.createTransport);

module.exports = router;
