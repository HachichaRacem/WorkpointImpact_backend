const mongoose = require("mongoose");

const ScheduleSchema = new mongoose.Schema({
  Date: Date,
  Slot: String,
  User: String,
  Type: String,
  Adresse: String,
  codePostal: Number,
  Zone: String,
  sequence: Number,

  Destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Destination",
  },
});

module.exports = mongoose.model("Schedule", ScheduleSchema);