const Assignment = require("../models/Assignment");
const UserLog = require("../models/UserLog");
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
  return { calcCourseProgress, fetchUserLogs };
}

module.exports = statsService;
