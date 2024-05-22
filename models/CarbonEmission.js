const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CarbonEmissionSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', },
  date: Date,
  totalDistance: Number,
  totalDuration:Number,
  carbonEmission: Number,
  formule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Formule",
  },
});

module.exports = mongoose.model('CarbonEmission', CarbonEmissionSchema);