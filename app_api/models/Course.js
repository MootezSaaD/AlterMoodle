const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    courseCode: {
      type: String,
      required: true,
      unique: true
    },
    courseMoodleID: {
      type: Number
    },
    courseDesc: {
      type: String,
      default: ""
    },
    grade: {
      type: String,
      default: "-"
    },
    _user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { strict: false }
);

module.exports = mongoose.model("Course", CourseSchema);
