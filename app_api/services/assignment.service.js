const moodle = require("moodle-client");
const Assignment = require("../models/Assignment");
const userService = require("./user.service");
const User = require("../models/User");
const Submission = require("../models/Submission");
const mongoose = require("mongoose");
const { ErrorHandler } = require("../helpers/errorHandler");

function assignmentService() {
  // Get user's assignments from moodle
  async function getUserAssignments(moodleToken, coursesArr) {
    const res = moodle
      .init({
        wwwroot: process.env.MOODLE_URL,
        token: moodleToken,
      })
      .then((client) => {
        return client
          .call({
            wsfunction: "core_calendar_get_action_events_by_courses",
            args: {
              courseids: coursesArr,
            },
          })
          .then((courses) => {
            return courses;
          });
      })
      .catch((err) => {
        throw new Error(err);
      });
    return Promise.resolve(res);
  }
  // Store assignments in the database
  async function storeAssignments(finalAssignments) {
    // Store assignments in the databse
    Assignment.insertMany(finalAssignments, { ordered: false })
      .then((docs) => {})
      .catch((err) => {
        console.error("Duplicate docs were found and were not stored");
      });
  }
  // Get user's assignments from database
  async function fetchUserAssignments(userID) {
    return Assignment.aggregate([
      { $match: { _user: mongoose.Types.ObjectId(userID) } },
      {
        $group: {
          _id: "$course.courseCode",
          courseInfo: {
            $first: {
              courseName: "$course.courseName",
              courseID: "$course.courseMoodleID",
            },
          },
          assignment: {
            $push: {
              id: "$_id",
              name: "$name",
              description: "$description",
              expDate: "$expDate",
              status: "$status",
              url: "$url",
            },
          },
        },
      },
    ]);
  }
  // Mark assignment as done
  async function markAsDone(assignmentID) {
    let assignment = await Assignment.findById(assignmentID);
    assignment.status = true;
    await assignment
      .save()
      .then((doc) => {})
      .catch((err) => {
        throw new ErrorHandler(500, "Could save assignment status");
      });
  }
  // Update/add submission to database
  async function storeSubmissionInDB(assignmentID, subDir, userID) {
    let submission = new Submission({
      _assignment: mongoose.Types.ObjectId(assignmentID),
      directory: subDir,
      _user: mongoose.Types.ObjectId(userID),
    });
    await submission.save();
  }
  // Fetch submission from database
  async function fetchSub(assignmentID, userID) {
    return Submission.find({
      _assignment: mongoose.Types.ObjectId(assignmentID),
      _user: mongoose.Types.ObjectId(userID),
    });
  }
  return {
    storeAssignments,
    getUserAssignments,
    fetchUserAssignments,
    markAsDone,
    storeSubmissionInDB,
    fetchSub,
  };
}

module.exports = assignmentService;
