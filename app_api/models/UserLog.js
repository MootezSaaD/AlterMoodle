const mongoose = require("mongoose");

const userLogSchema = new mongoose.Schema({
  duration: {
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
  activity: {
    type: String,
    required: true,
  },
  _user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("UserLog", userLogSchema);
