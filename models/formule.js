const mongoose = require("mongoose");
const formuleSchema = new mongoose.Schema({
    name: String,
    value: String,
});

module.exports = mongoose.model("Formule", formuleSchema);