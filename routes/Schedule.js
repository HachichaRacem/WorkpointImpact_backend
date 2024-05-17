const express = require("express");
const router = express.Router();
const scheduleController = require("../controllers/Schedule");
const upload = require("../Middleware/upload");

router.get("/", scheduleController.getAllSchedules);
router.post(
  "/upload",
  upload.single("file"),
  scheduleController.uploadScheduleData
);
router.get("/:user/:date", scheduleController.getScheduleForUserAndDate);
router.get("/:user", scheduleController.getAllSchedulesByUser);
router.post(
  "/add",

  scheduleController.addScheduleData
);

module.exports = router;
