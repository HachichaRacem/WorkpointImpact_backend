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
  hashed_password: {
    type: String,
    //  required: true
  },
  salt: String,
});
UserSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  authenticate_old_password: function (plainText) {
    return this.encryptPassword(plainText) === this.old_password;
  },

  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
}
module.exports = mongoose.model("Member", memberSchema);
