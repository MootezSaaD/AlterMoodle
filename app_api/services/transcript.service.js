require("dotenv").config();
const moodle = require("moodle-client");
const { ErrorHandler } = require("../helpers/errorHandler");
const _ = require("lodash");

function transcriptService() {
  // Get user's enrolled courses (following the Course Model)
  async function fetchUsersCourses(userID, moodleToken) {
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
                courseid: course.id,
                courseDesc: course.fullname,
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
  // Get user's grades from moodle
  async function getUserGrades(userID, moodleToken) {
    const res = moodle
      .init({
        wwwroot: process.env.MOODLE_URL,
        token: moodleToken,
      })
      .then((client) => {
        return client
          .call({
            wsfunction: "gradereport_overview_get_course_grades",
            args: {
              userid: userID,
            },
          })
          .then(async (grades) => {
            return grades.grades;
          });
      })
      .catch((err) => {
        throw new ErrorHandler(err);
      });
    return Promise.resolve(res);
  }
  // Return users transcript
  async function getTranscript(courseArr, gradesArr) {
    const transcript = _.map(courseArr, function (item) {
      return _.extend(item, _.find(gradesArr, { courseid: item.courseid }));
    });
    return transcript;
  }
  // Return grades of one course
  async function getCourseGrades(userID, courseID, moodleToken) {
    const res = moodle
      .init({
        wwwroot: process.env.MOODLE_URL,
        token: moodleToken,
      })
      .then((client) => {
        return client
          .call({
            wsfunction: "gradereport_user_get_grades_table",
            args: {
              userid: userID,
              courseid: courseID,
            },
          })
          .then(async (course) => {
            if (course.errorcode) {
              throw new ErrorHandler(401, "Not enrolled in that course");
            }
            let tablesArr = course.tables[0].tabledata;
            let finalRes = [];
            // Because the first element contains the cours's details
            for (let i = 1; i < tablesArr.length; i++) {
              // Check if the element is not array
              // (when items or assignments are deleted we get empty arrays)
              let pred = tablesArr[i] instanceof Array;
              if (!pred) {
                finalRes.push({
                  itemname: tablesArr[i].itemname.content.replace(
                    /(<([^>]+)>)/gi,
                    ""
                  ),
                  grade: tablesArr[i].grade.content,
                });
              }
            }
            return finalRes;
          });
      })
      .catch((err) => {
        console.log("ERR", err);
        throw new ErrorHandler(500, err.message);
      });
    return Promise.resolve(res);
  }
  return { fetchUsersCourses, getUserGrades, getTranscript, getCourseGrades };
}

module.exports = transcriptService;
