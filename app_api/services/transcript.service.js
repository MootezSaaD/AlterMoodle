require("dotenv").config();
const moodle = require("moodle-client");
const _ = require("lodash");

function transcriptService() {
  // Get user's enrolled courses (following the Course Model)
  async function fetchUsersCourses(userID, moodleToken) {
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
            let coursesArr = [];
            courses.forEach(course => {
              coursesArr.push({
                courseCode: course.shortname,
                courseid: course.id,
                courseDesc: course.fullname
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
  // Get user's grades from moodle
  async function getUserGrades(userID, moodleToken) {
    const res = moodle
      .init({
        wwwroot: process.env.MOODLE_URL,
        token: moodleToken
      })
      .then(client => {
        return client
          .call({
            wsfunction: "gradereport_overview_get_course_grades",
            args: {
              userid: userID
            }
          })
          .then(async grades => {
            return grades.grades;
          });
      })
      .catch(err => {
        throw new Error(err);
      });
    return Promise.resolve(res);
  }
  // Return users transcript
  async function getTranscript(courseArr, gradesArr) {
    const transcript = _.map(courseArr, function(item) {
      return _.extend(item, _.find(gradesArr, { courseid: item.courseid }));
    });
    return transcript;
  }
  return { fetchUsersCourses, getUserGrades, getTranscript };
}

module.exports = transcriptService;
