const express = require("express");
const router = express.Router();
const transportController = require("../controllers/Transport");
const authenticateToken = require("../Middleware/auth.middleware");
require('dotenv').config();
router.get("/",authenticateToken, transportController.getAllTransports);
router.post("/",authenticateToken,transportController.createTransport);
router.put("/update/:id",authenticateToken,transportController.updateTransport);
module.exports = router;
