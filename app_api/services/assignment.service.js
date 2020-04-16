const moodle = require("moodle-client");
const Assignment = require("../models/Assignment");
const userService = require("./user.service");
const User = require("../models/User");
const Submission = require("../models/Submission");
const mongoose = require("mongoose");
const { ErrorHandler } = require("../helpers/errorHandler");
const fs = require("fs");
const pretty = require("pretty");
const pdf = require("html-pdf");
const options = { format: "Letter" };

function assignmentService() {
  //Get assignment by id from database
  async function getAssignmentByID(assignmentID) {
    return Assignment.findById(assignmentID);
  }
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
            wsfunction: "mod_assign_get_assignments",
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
    let sort = { $sort: { expDateInt: 1 } };
    let match = { $match: { _user: mongoose.Types.ObjectId(userID) } };
    let group = {
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
    };
    return Assignment.aggregate([sort, match, group]);
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
  // Convert submission from HTML to PDF
  async function uploadToMoodle(file, pdfFile, moodleToken, assignmentID) {
    await pdf.create(file, options).toFile(pdfFile, (err, data) => {
      if (err) {
        throw new ErrorHandler(500, "Conversion to PDF Failed");
      }
      console.log(data);
      let files = {
        file: fs.createReadStream(data.filename),
      };
      const res = moodle
        .init({
          wwwroot: process.env.MOODLE_URL,
          token: moodleToken,
        })
        .then((client) => {
          return client
            .upload({
              files: files,
            })
            .then((draftfiles) => {
              console.log(draftfiles);
              // Copy files from the draft area to the persistent private files area.
              return client
                .call({
                  wsfunction: "mod_assign_save_submission",
                  args: {
                    assignmentid: assignmentID,
                    "plugindata[onlinetext_editor][text]": "done",
                    "plugindata[onlinetext_editor][format]": 1,
                    "plugindata[onlinetext_editor][itemid]":
                      draftfiles[0].itemid,
                    "plugindata[files_filemanager]": draftfiles[0].itemid,
                  },
                })
                .then(() => {
                  console.log(
                    "Assignment Successfully submitted !",
                    draftfiles.length
                  );
                  return;
                });
            })
            .catch((err) => {
              console.log("Error uploading the file: " + err);
              return;
            });
        });
    });
  }

  return {
    getAssignmentByID,
    storeAssignments,
    getUserAssignments,
    fetchUserAssignments,
    markAsDone,
    storeSubmissionInDB,
    fetchSub,
    uploadToMoodle,
  };
}

module.exports = assignmentService;
