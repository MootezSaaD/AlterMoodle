const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

let UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    moodleToken: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      min: 6
    },
    moodleUserID: {
      type: Number,
      required: false
    },
    courses: []
  },
  { strict: false }
);

module.exports = mongoose.model("User", UserSchema);
