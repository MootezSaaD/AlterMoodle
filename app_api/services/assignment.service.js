const moodle = require("moodle-client");
const Assignment = require("../models/Assignment");
const userService = require("./user.service");
const User = require("../models/User");
const mongoose = require("mongoose");

function assignmentService() {
  // Get user's assignments from moodle
  async function getUserAssignments(moodleToken, coursesArr) {
    const res = moodle
      .init({
        wwwroot: process.env.MOODLE_URL,
        token: moodleToken
      })
      .then(client => {
        return client
          .call({
            wsfunction: "core_calendar_get_action_events_by_courses",
            args: {
              courseids: coursesArr
            }
          })
          .then(courses => {
            return courses;
          });
      })
      .catch(err => {
        throw new Error(err);
      });
    return Promise.resolve(res);
  }
  // Store assignments in the database
  async function storeAssignments(finalAssignments) {
    // Store assignments in the databse
    Assignment.insertMany(finalAssignments, { ordered: false })
      .then(docs => {})
      .catch(err => {
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
            $push: {
              courseName: "$course.courseName",
              courseID: "$course.courseMoodleID"
            }
          },
          assignment: {
            $push: {
              id: "$_id",
              name: "$name",
              description: "$description",
              expDate: "$expDate",
              status: "$status",
              url: "$url"
            }
          }
        }
      }
    ]);
  }
  return { storeAssignments, getUserAssignments, fetchUserAssignments };
}

module.exports = assignmentService;
