const mongoose = require("mongoose");

const userLogSchema = new mongoose.Schema({
  timeInt: {
    type: Number,
    required: true,
  },
  day: {
    type: String,
    required: true,
  },
  monthYr: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  _user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("UserLog", userLogSchema);
