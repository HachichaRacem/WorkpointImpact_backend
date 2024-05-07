const mongoose = require("mongoose");
const profileSchema = new mongoose.Schema({
    fullName: String,
    Privillage: String,
});


module.exports = mongoose.model("profile", profileSchema);


