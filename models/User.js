const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: { type: String, required: true, unique: true },
  token: String,
  hash: String,
  salt: String,
  username: { type: String, required: true, unique: true },
  name: String
});

module.exports = User;
