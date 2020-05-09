require("dotenv").config();
const moodle = require("moodle-client");
const { ErrorHandler } = require("../helpers/errorHandler");

function moodleService() {
  // Get user's moodle id
  async function getUserMoodleID(userToken) {
    const userid = moodle
      .init({
        wwwroot: process.env.MOODLE_URL,
        token: userToken,
      })
      .then((client) => {
        return client
          .call({
            wsfunction: "core_webservice_get_site_info",
          })
          .then(async function (info) {
            return info.userid;
          });
      })
      .catch((err) => {
        throw new ErrorHandler(err);
      });
    return Promise.resolve(userid);
  }

  // Get user's enrolled courses ids and store them in the user's document
  async function getUsersCoursesIDS(userID, moodleToken) {
    const res = moodle
      .init({
        wwwroot: process.env.MOODLE_URL,
        token: moodleToken,
      })
      .then((client) => {
        return client
          .call({
            wsfunction: "core_enrol_get_users_courses",
            args: {
              userid: userID,
            },
          })
          .then(async (courses) => {
            let coursesIDS = [];
            courses.forEach((course) => {
              coursesIDS.push(course.id);
            });
            return coursesIDS;
          });
      })
      .catch((err) => {
        throw new ErrorHandler(err);
      });
    return Promise.resolve(res);
  }
  // Get user's enrolled courses (following the Course Model)
  async function getUsersCourses(userID, moodleToken, _userdid) {
    const res = moodle
      .init({
        wwwroot: process.env.MOODLE_URL,
        token: moodleToken,
      })
      .then((client) => {
        return client
          .call({
            wsfunction: "core_enrol_get_users_courses",
            args: {
              userid: userID,
            },
          })
          .then(async (courses) => {
            let coursesArr = [];
            courses.forEach((course) => {
              coursesArr.push({
                courseCode: course.shortname,
                courseMoodleID: course.id,
                courseDesc: course.fullname,
                _user: _userdid,
              });
            });
            return coursesArr;
          });
      })
      .catch((err) => {
        throw new ErrorHandler(err);
      });
    return Promise.resolve(res);
  }
  // Store courses in the database
  // async function storeCourses(coursesArr) {
  //   Course.insertMany(coursesArr, { ordered: false })
  //     .then(docs => {})
  //     .catch(err => {
  //       throw err;
  //     });
  // }
  return {
    getUserMoodleID,
    getUsersCoursesIDS,
    getUsersCourses,
  };
}

module.exports = moodleService;
