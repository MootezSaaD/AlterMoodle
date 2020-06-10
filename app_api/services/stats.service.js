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
    let sort = { $sort: { _id: 1 } };
    let match = { $match: { _user: mongoose.Types.ObjectId(userId) } };
    let group = {
      $group: {
        _id: "$monthYr",
        durations: {
          $push: {
            duration: { $abs: "$duration" },
          },
        },
      },
    };
    let durations = await UserLog.aggregate([match, group, sort]);
    let results = [];
    for (const duration of durations) {
      let timeSpans = [];
      for (const timeSpan of duration.durations) {
        timeSpans.push(timeSpan.duration);
      }
      results.push({
        day: duration._id,
        durations: timeSpans,
      });
    }
    return results;
  }

  return { calcCourseProgress, fetchUserLogs };
}

module.exports = statsService;
