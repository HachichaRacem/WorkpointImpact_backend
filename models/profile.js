const mongoose = require("mongoose");
const profileSchema = new mongoose.Schema({
    name: String,
    description : String,
    privillages: [],
});


module.exports = mongoose.model("Profile", profileSchema);


