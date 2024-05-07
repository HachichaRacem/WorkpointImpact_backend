const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
  date: Date,
  slot: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Member",
  },
  type: String,
  adresse: String,
  codePostal: Number,
  zone: String,
  sequence: Number,

  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Destination",
  },
});

module.exports = mongoose.model("Schedule", ScheduleSchema);