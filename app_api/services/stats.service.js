const Assignment = require("../models/Assignment");
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
          total: { $sum: 1 },
          total_finished: { $sum: { $cond: ["$status", 1, 0] } },
          total_unfinished: { $sum: { $cond: ["$status", 0, 1] } },
        },
      },
    ]);
  }
  return { calcCourseProgress };
}

module.exports = statsService;
