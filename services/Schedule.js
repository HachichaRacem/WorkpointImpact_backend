// services/ScheduleService.js
const Schedule = require('../models/Schedule');

exports.getAllSchedules = async () => {
  try {
    return  await Schedule.find({});
  } catch (error) {
    throw error;
  }
};


exports.uploadScheduleData = async (data) => {
  try {
    // Insert Excel data into the database
    await Schedule.insertMany(data);
  } catch (error) {
    throw new Error(`Error uploading schedule data: ${error.message}`);
  }
};
exports.getAllSchedulesByUser = async (user) => {
  try {
    return await Schedule.find({ User: user }).populate("Destination");
  } catch (error) {
    throw error;
  }
};
exports.getScheduleForUserAndDate = async (user,date) => {
  try {
  const allSchedule = await Schedule
    .find({ user: user, date: date }).populate([{ path: 'destination' }, { path: 'user', populate: { path: 'vehicle' } }])
    .sort({ sequence: 1 });
  console.log("allSchedule", allSchedule);
  return allSchedule;
} catch (e) {
  console.log("ERROR: ", e);
  throw e.message
}
};
