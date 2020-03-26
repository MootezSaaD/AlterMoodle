const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema(
  {
    _courseid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course"
    },
    moodleid: {
      type: Number,
      required: true
    },
    description: {
      type: String,
      default: "No description"
    },
    status: {
      type: Boolean,
      default: false
    }
  },
  { strict: false }
);

module.exports = mongoose.model("Assignment", AssignmentSchema);
