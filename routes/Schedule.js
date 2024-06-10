const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/Schedule");
const upload = require("../Middleware/upload");
const authenticateToken = require("../Middleware/auth.middleware");
require('dotenv').config();
router.get("/", scheduleController.getAllSchedules);
router.post(
  "/upload",
  upload.single("file"),
  scheduleController.uploadScheduleData
);
router.get("/:user/:date",authenticateToken, scheduleController.getScheduleForUserAndDate);
router.get("/:user",authenticateToken, scheduleController.getAllSchedulesByUser);
router.post(
  "/add",

  scheduleController.addScheduleData
);

module.exports = router;
