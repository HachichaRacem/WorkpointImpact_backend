const scheduleService = require('../services/Schedule');
const destinations = require('../models/Destination');
const members = require('../models/Member');
const transports = require('../models/Transport');
const XLSX = require('xlsx');


exports.getAllSchedules = async (req, res) => {
  try {
    const allSchedules = await scheduleService.getAllSchedules(); // Ensure the function name is correct
    res.json(allSchedules);
  } catch (error) {
    console.error("Error fetching schedules:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.uploadScheduleData = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const bufferArray = req.file.buffer;
    const wb = XLSX.read(bufferArray, { type: 'buffer' });
    const wsname = wb.SheetNames[0];
    const ws = wb.Sheets[wsname];
    const data = XLSX.utils.sheet_to_json(ws);

    // Upload Excel data to the schedule
    await scheduleService.uploadScheduleData(data);

    res.json({ message: 'Schedule data uploaded successfully.' });
  } catch (error) {
    console.error('Error uploading Excel data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
exports.getScheduleForUserAndDate = async (req, res) => {
  try {
  const user = req.params.user;
  const date = new Date(req.params.date);
  const allSchedule = await schedule
    .find({ User: user, Date: date })
  console.log("allSchedule", allSchedule);
  const sortedResult = allSchedule.sort((a, b) => {
    return a.sequence - b.sequence;
  });
  var result = [];
  for (const item of sortedResult) {
    const dest = await destinations.findOne({ _id: item.Destination });
    result.push({ ...item, Destination: dest });
  }
  
  const driver = await members.findOne({ fullName: user });
  const car = await transports.findOne({ _id: driver.vehicle });


  const data = {
    schedule: result,
    car: car,
  };

  console.log("destination", data);
  res.json(data);
} catch (e) {
  console.log("ERROR: ", e);
}
};