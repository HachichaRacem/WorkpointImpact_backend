const mongoose = require("mongoose");

const DestinationSchema = new mongoose.Schema({
    name: String,
    email: String,
    phoneNumber: String,
    type: String,
    address: String,
    postalCode: String,
  
    zone: String,
    longitude: String,
    latitude: String,
  });
  
  module.exports = mongoose.model("Destination", DestinationSchema);