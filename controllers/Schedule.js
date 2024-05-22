const scheduleService = require("../services/Schedule");
const destinations = require("../models/Destination");

const transports = require("../models/Transport");
const schedule = require("../models/Schedule");
const XLSX = require("xlsx");
const { patch } = require("../routes/Member");

exports.getAllSchedules = async (req, res) => {
  try {
    const allSchedules = await scheduleService.getAllSchedules();
    res.json(allSchedules);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res.status(400).json({ message: "Internal Server Error" });
  }
};

exports.addScheduleData = async (req, res) => {
  try {
    await scheduleService.addScheduleData(req.body);
    res.json({ status: 200, message: "success" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.uploadScheduleData = async (req, res) => {
  try {
    console.log("hello!!!!!!", req.file);
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const data = await scheduleService.uploadScheduleData(req.file);

    res.json({
      message: "Schedule data uploaded successfully.",
      data: data,
      status: 200,
    });
  } catch (error) {
    console.log("Error uploading Excel data:", error);
    res.status(400).json({ message: "Internal Server Error" });
  }
};
/*exports.getScheduleForUserAndDate = async (req, res) => {
  try {
  const user = req.params.user;
  const date = new Date(req.params.date);
  const allSchedule = await schedule
    .find({ user: user, date: date }).populate([{ path: 'destination' }, { path: 'user', populate: { path: 'vehicle' } }])
    .sort({ sequence: 1 });
  console.log("allSchedule", allSchedule);
  res.json(allSchedule);
} catch (e) {
  console.log("ERROR: ", e);
}
};*/
exports.getScheduleForUserAndDate = async (req, res) => {
  try {
    const user = req.params.user;
    const date = new Date(req.params.date);
    const allSchedules = await scheduleService.getScheduleForUserAndDate(
      user,
      date
    );

    res.json(allSchedules);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res.status(400).json({ message: "Internal Server Error" });
  }
};
exports.getAllSchedulesByUser = async (req, res) => {
  try {
    const user = req.params.user;
    const allSchedules = await scheduleService.getAllSchedulesByUser(user);
    res.json(allSchedules);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res.status(400).json({ message: "Internal Server Error" });
  }
};
