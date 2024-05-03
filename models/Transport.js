const mongoose = require("mongoose");

const TransportSchema = new mongoose.Schema({
    brand: String,
    model: String,
    matricule: Number,
    fueltype: String,
    horspowere:Number,
    fuelcons : Number,
    fuelEfficiency : Number,
    type : String,
    circulationDate : Date,
    
});

module.exports = mongoose.model("Transport", TransportSchema);