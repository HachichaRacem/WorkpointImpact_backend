// services/ScheduleService.js
const Schedule = require('../models/Schedule');
const Member = require('../models/Member');
const Destination = require('../models/Destination');
const memberService = require("../services/Member.js");
const destinationService = require("../services/Destination");
const XLSX = require('xlsx');


exports.getAllSchedules = async () => {
  try {
    return await Schedule.find({});
  } catch (error) {
    throw error;
  }
};


exports.uploadScheduleData = async (file) => {
  try {
    const bufferArray = file.buffer;
    const wb = XLSX.read(bufferArray, { type: 'buffer' });
    const wsname = wb.SheetNames[0];
    const ws = wb.Sheets[wsname];
    const data = XLSX.utils.sheet_to_json(ws);
    console.log("data", data);
    const newData = await Promise.all(
     data.map(async item => {
      var idUser = await Member.findOne({ fullName: {
        $regex: new RegExp(item.User.toLowerCase(), 'i')
     } })
      var idDestination = await Destination.findOne({ destination: {
        $regex: new RegExp(item.Destination.toLowerCase(), 'i')
     } })
     if(!idUser){

      idUser = await memberService.createMember({fullName:item.User})
      
     }
     if(!idDestination){

      idDestination = await destinationService.createDestination({name:item.Destination,address:item.Adresse,postalCode:item["Code Postal"],zone:item.Zone})
      
     }
     console.log("idUser",idUser,idDestination)
      return { user: idUser._id, date: new Date(item.Date), slot: item.Slot, zone: item.Zone, codepostal: item["Code Postal"], adresse: item.Adresse, type: item.Type, destination: idDestination._id }
    })
    )
    // Insert Excel data into the database
    console.log("newdata",newData);
    await Schedule.insertMany(newData);
  } catch (error) {
    throw new Error(`Error uploading schedule data: ${error.message}`);
  }
};
exports.getAllSchedulesByUser = async (user) => {
  try {
    return await Schedule.find({ user: user }).populate([{ path: 'destination' }, { path: 'user', populate: { path: 'vehicle' } }])
  } catch (error) {
    throw error;
  }
};
exports.getScheduleForUserAndDate = async (user, date) => {
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
