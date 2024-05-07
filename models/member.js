// models/Member.js
const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  fullName: String,
  email: String,
  long: { type: mongoose.Schema.Types.Decimal128 },
  address: String,
  lat: { type: mongoose.Schema.Types.Decimal128 },
  postalCode: Number,
  vehicle: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transport",
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Profile",
  },
});

module.exports = mongoose.model("Member", memberSchema);
