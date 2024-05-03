// services/ScheduleService.js
const ScheduleModel = require('../models/Schedule');

exports.getAllSchedules = async () => {
  try {
    return  await ScheduleModel.find({});
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
