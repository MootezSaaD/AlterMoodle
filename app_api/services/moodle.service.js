require("dotenv").config();
const userService = require("../services/user.service")();
const moodle = require("moodle-client");
const User = require("../models/User");

function moodleService() {
  // Get user's moodle id
  async function getUserMoodleID(userToken) {
    const userid = moodle
      .init({
        wwwroot: process.env.MOODLE_URL,
        token: userToken
      })
      .then(client => {
        return client
          .call({
            wsfunction: "core_webservice_get_site_info"
          })
          .then(async function(info) {
            return info.userid;
          });
      })
      .catch(err => {
        throw new Error(err);
      });
    return Promise.resolve(userid);
  }

  // Get user's enrolled courses
  async function getUsersCourses(userID, moodleToken) {
    const res = moodle
      .init({
        wwwroot: process.env.MOODLE_URL,
        token: moodleToken
      })
      .then(client => {
        return client
          .call({
            wsfunction: "core_enrol_get_users_courses",
            args: {
              userid: userID
            }
          })
          .then(async courses => {
            let coursesIDS = [];
            courses.forEach(course => {
              coursesIDS.push(course.id);
            });
            return coursesIDS;
          });
      })
      .catch(err => {
        throw new Error(err);
      });
    return Promise.resolve(res);
  }
  // Get user's assignments from moodle
  async function getUserMoodleAssignments(userID) {
    const user = await userService.getUserByID(userID);
    const res = moodle
      .init({
        wwwroot: process.env.MOODLE_URL,
        token: user.moodleToken
      })
      .then(client => {
        return client
          .call({
            wsfunction: "core_calendar_get_action_events_by_courses",
            args: {
              courseids: user.moodleUserID
            }
          })
          .then(courses => {
            let coursesArr = [];
            courses.forEach(course => {
              coursesArr.push({
                id: course.id,
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
  return { getUserMoodleID, getUsersCourses, getUserMoodleAssignments };
}

module.exports = moodleService;
