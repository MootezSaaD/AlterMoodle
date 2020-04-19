const Router = require("express").Router;
const { verifyJwt } = require("../../helpers/verifyToken");
const assignmentService = require("../../services/assignment.service")();
const userService = require("../../services/user.service")();
const moodleService = require("../../services/moodle.service")();
const fs = require("fs");
const pretty = require("pretty");
const pdf = require("html-pdf");
const options = { format: "Letter" };
const moment = require("moment");
const router = Router({
  mergeParams: true,
});

/**
 * Get assignments from moodle.
 */
router.get("/get/mdl/assignments", verifyJwt, async (req, res) => {
  let user = await userService.getUserByID(req.decodedToken._id);
  const courseArr = await moodleService.getUsersCoursesIDS(
    user.moodleUserID,
    user.moodleToken
  );
  let assignmentsQuery = await assignmentService.getUserAssignments(
    user.moodleToken,
    courseArr
  );
  let interAssignment = assignmentsQuery.courses;

  let final = [];
  for (let courseAssignment in interAssignment) {
    let pre = interAssignment[courseAssignment].assignments;
    for (let a in pre) {
      final.push({
        assignmentID: pre[a].id,
        name: pre[a].name,
        description: pre[a].intro,
        url:
          "http://192.168.126.129/moodle/mod/assign/view.php?id=" + pre[a].cmid,
        course: {
          courseMoodleID: interAssignment[courseAssignment].id,
          courseCode: interAssignment[courseAssignment].shortname,
          courseName: interAssignment[courseAssignment].fullname,
        },
        expDate: moment(pre[a].duedate * 1000).format("LLLL"),
        expDateInt: pre[a].duedate * 1000,
        status: false,
        finishedAt: 0,
        _user: user._id,
      });
    }
  }
  // Store newly fetched assignments in the database
  await assignmentService.storeAssignments(final);
  return res.status(200).send({
    success: true,
    message: "Assignments have been stored",
  });
});
/**
 * Update assignments' status by checking the submission status
 */
router.get("/assignments/status/update", verifyJwt, async (req, res) => {
  // Get user
  let user = await userService.getUserByID(req.decodedToken._id);
  // Fetch user's assignments that are unfinished.
  let unfinishedAssignment = await assignmentService.getUnfinished(
    req.decodedToken._id
  );
  // Make an API call to Moodle's endpoint to check whether if a submission exists or not.
  unfinishedAssignment.forEach(async (assisgn) => {
    let assignmentStatus = await assignmentService.checkStatus(
      assisgn.assignmentID,
      user.moodleToken
    );
    // Update assignment status if a submission exists
    let result =
      assignmentStatus.lastattempt.submission.plugins[0].fileareas[0].files
        .length;
    if (result > 0) {
      await assignmentService.markAsDone(
        assisgn._id,
        assignmentStatus.lastattempt.submission.plugins[0].fileareas[0].files[0]
          .timemodified * 1000
      );
    }
  });
  return res.status(200).send({
    success: true,
    message: "Assignments status updated",
  });
});
/**
 * Get assignments from the database
 */
router.get("/assignments", verifyJwt, async (req, res) => {
  // Fetch courses (always updated) from the database
  let finalRes = await assignmentService.fetchUserAssignments(
    req.decodedToken._id
  );
  return res.status(200).send(finalRes);
});

/**
 * Store a submission as a file and in database
 * Ideas: convert to pdf only when submitting the assignment
 * to moodle.
 */
router.post("/submission/:id", verifyJwt, async (req, res) => {
  // Fetch the user
  let user = await userService.getUserByID(req.decodedToken._id);
  // Fetch the assignment info
  let assignmentInfo = await assignmentService.getAssignmentByID(req.params.id);
  //Create folder (if it does exist) of the user
  if (!fs.existsSync("app_api/files/" + user._id)) {
    fs.mkdirSync("app_api/files/" + user._id);
  }
  //Save submission file
  let fileName =
    "app_api/files/" +
    user._id +
    "/" +
    user.firstName +
    user.lastName +
    "_" +
    assignmentInfo.name.trim() +
    ".html";
  fs.writeFile(fileName, pretty(req.body.content), (err, data) => {
    if (err) {
      return res.status(500).send({
        success: false,
        message: "Error",
      });
    }
  });
  /**
   * Save submission to the database.
   * First check if the submission doc exists, if it does do nothing, otherwise, store it in database
   */
  let sub = await assignmentService.fetchSub(req.body._assignment, user._id);
  //If submission does not exist in the database, store it
  if (sub.length === 0) {
    await assignmentService.storeSubmissionInDB(
      req.body._assignment,
      fileName,
      user._id
    );
  }
  return res.status(200).send({
    success: true,
    message: "Submission has been successfully stored",
  });
});

/**
 * Get a submission body
 */
router.get("/submission/:id", verifyJwt, async (req, res) => {
  let user = await userService.getUserByID(req.decodedToken._id);
  let subbmission = await assignmentService.fetchSub(req.params.id, user._id);
  if (subbmission.length === 0) {
    return res.status(200).send({
      data: "",
    });
  }
  let path = subbmission[0].directory;
  let content = fs.readFileSync(path, "utf8");
  return res.status(200).send({
    data: content,
  });
});
/**
 * Mark an assignment as done
 */
router.put("/assignment/:id", verifyJwt, async (req, res) => {
  await assignmentService.markAsDone(req.params.id, Date.now());
  return res.status(200).send({
    success: true,
    message: "Assignment has been marked done successfully",
  });
});

/**
 * Submit assignment (submission to moodle)
 */
router.post("/submission/add/:id", verifyJwt, async (req, res) => {
  let user = await userService.getUserByID(req.decodedToken._id);
  let assignment = await assignmentService.getAssignmentByID(req.params.id);
  // Mark when the assignment was finished
  assignment.finishedAt = Date.now();
  assignment.status = true;
  await assignment.save();
  let fileName =
    "app_api/files/" +
    user._id +
    "/" +
    user.firstName +
    user.lastName +
    "_" +
    assignment.name.trim();
  let filePath = fileName + ".html";
  let pdfFilePath = fileName + ".pdf";
  let file = fs.readFileSync(filePath, "utf8");
  // Upload the assignment to moodle
  // It will be converted to pdf first then uploaded
  await assignmentService.uploadToMoodle(
    file,
    pdfFilePath,
    user.moodleToken,
    assignment.assignmentID
  );
  return res.status(200).send({
    success: true,
    message: "Assignment has been successfully submitted !",
    url: assignment.url,
  });
  //Update the assignment status in the frontend
});

module.exports = router;
