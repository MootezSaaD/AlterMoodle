const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  moodleID: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    default: ""
  },
  description: {
    type: String,
    default: ""
  },
  url: {
    type: String,
    default: ""
  },
  expDate: {
    type: String,
    default: ""
  },
  status: {
    type: Boolean,
    default: false
  },
  course: {
    courseMoodleID: {
      type: Number
    },
    courseCode: {
      type: String,
      default: ""
    },
    courseName: {
      type: String,
      default: ""
    }
  },
  _user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
});
/**
 * Here we need to ensure the uniquness of the assignment by two fields: the user and the moodleid,
 * since different users can have the same assignments
 */
assignmentSchema.index({ moodleID: 1, _user: 1 }, { unique: true });
module.exports = mongoose.model("Assigment", assignmentSchema);
