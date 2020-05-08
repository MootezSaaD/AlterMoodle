const Assignment = require("../models/Assignment");
const UserLog = require("../models/UserLog");
const moment = require("moment");
const mongoose = require("mongoose");
function statsService() {
  //Get number of unfinished assignments of a specific course
  async function calcCourseProgress(courseId, userId) {
    return Assignment.aggregate([
      {
        $match: {
          _user: mongoose.Types.ObjectId(userId),
          "course.courseMoodleID": courseId,
        },
      },
      {
        $group: {
          _id: "$course.courseCode",
          Finished: { $sum: { $cond: ["$status", 1, 0] } },
          Unfinished: { $sum: { $cond: ["$status", 0, 1] } },
        },
      },
    ]);
  }
  // Return the user's logs
  async function fetchUserLogs(userId) {
    return UserLog.find({ _user: userId });
  }
  // Record user logs
  async function storeUserLogs(userId) {
    const day = moment().format("dddd"); // Sunday
    const monthYr = moment().format("MMM Do YYYY"); // May 3rd 2020
    const time = moment().format("LT"); // e.g 2:21 PM
    await UserLog.create({
      timeInt: Date.now(),
      day,
      monthYr,
      time,
      _user: userId,
    });
  }
  return { calcCourseProgress, fetchUserLogs, storeUserLogs };
}

module.exports = statsService;
