const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/Schedule');
const upload = require('../Middleware/upload');

router.get('/', scheduleController.getAllSchedules);
router.post('/', upload.single('file'), scheduleController.uploadScheduleData);
router.get('/:user/:date', scheduleController.getScheduleForUserAndDate);
router.get("/:user", scheduleController.getAllSchedulesByUser);
module.exports = router;
