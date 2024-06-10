const mongoose = require("mongoose");
const crypto = require("crypto");

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
  passwordText: String 
});
memberSchema.virtual("password")
  .set(function (password) {
    console.log('password in model',password)
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });
memberSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },

  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
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

