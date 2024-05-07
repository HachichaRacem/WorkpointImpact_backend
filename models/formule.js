const mongoose = require("mongoose");
const formuleSchema = new mongoose.Schema({
    fullName: String,
    value: { type: mongoose.Schema.Types.Decimal128 },
});

module.exports = mongoose.model("formule", formuleSchema);