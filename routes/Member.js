// routes/memberRoutes.js
const express = require("express");
const router = express.Router();
const memberController = require("../controllers/Member");
const authenticateToken = require("../Middleware/auth.middleware");
require('dotenv').config();

router.get("/",authenticateToken,memberController.getAllMembers);
router.post("/",authenticateToken, memberController.createMember);
router.put('/update/:id',authenticateToken,memberController.updateMember);
router.post('/login',memberController.signinAdmin);
module.exports = router;