require("dotenv").config();
const userService = require("../services/auth.service")();
const moodle = require("moodle-client");
const User = require("../models/User");

function moodleService() {
  // Get user's moodle id
  async function getUserMoodleID(userID) {
    const user = await userService.getUserByID(userID);
    moodle
      .init({
        wwwroot: process.env.MOODLE_URL,
        token: user.moodleToken
      })
      .then(function(client) {
        return client
          .call({
            wsfunction: "core_webservice_get_site_info"
          })
          .then(async function(info) {
            user.moodleUserID = info.userid;
            await user.save();
            return;
          });
      })
      .catch(function(err) {
        throw new Error(err);
      });
  }

  // Get user's enrolled courses
  async function getUsersCourses(userID) {
    const user = await userService.getUserByID(userID);
    const res = moodle
      .init({
        wwwroot: process.env.MOODLE_URL,
        token: user.moodleToken
      })
      .then(client => {
        return client
          .call({
            wsfunction: "core_enrol_get_users_courses",
            args: {
              userid: user.moodleUserID
            }
          })
          .then(courses => {
            let coursesArr = [];
            courses.forEach(course => {
              coursesArr.push({
                code: course.shortname,
                desc: course.fullname
              });
            });
            return coursesArr;
          });
      })
      .catch(err => {
        throw new Error(err);
      });
    return Promise.resolve(res);
  }
  return { getUserMoodleID, getUsersCourses };
}

module.exports = moodleService;
