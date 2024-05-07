// routes/memberRoutes.js
const express = require("express");
const router = express.Router();
const memberController = require("../controllers/Member");

router.get("/", memberController.getAllMembers);
router.post("/", memberController.createMember);
router.put('/update/:id', memberController.updateMember);
module.exports = router;