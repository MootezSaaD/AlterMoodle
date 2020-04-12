const Router = require("express").Router;
const { verifyJwt } = require("../../helpers/verifyToken");
const assignmentService = require("../../services/assignment.service")();
const userService = require("../../services/user.service")();
const moodleService = require("../../services/moodle.service")();
const fs = require("fs");
const pretty = require("pretty");
const pdf = require("html-pdf");
const options = { format: "Letter" };

const router = Router({
  mergeParams: true,
});

/**
 * Get assignments from moodle.
 */
router.get("/get-mdl-assignments", verifyJwt, async (req, res) => {
  let user = await userService.getUserByID(req.decodedToken._id);
  const courseArr = await moodleService.getUsersCoursesIDS(
    user.moodleUserID,
    user.moodleToken
  );
  let assignments = await assignmentService.getUserAssignments(
    user.moodleToken,
    courseArr
  );
  let groupedbycourse = assignments.groupedbycourse;
  let finalAssignments = [];
  // Define our array of assignments
  for (let assignment in groupedbycourse) {
    let pre = groupedbycourse[assignment].events;
    for (let a in pre) {
      finalAssignments.push({
        moodleID: pre[a].id,
        name: pre[a].name.replace(" is due", ""),
        description: pre[a].description,
        url: pre[a].url,
        course: {
          courseMoodleID: pre[a].course.id,
          courseCode: pre[a].course.shortname,
          courseName: pre[a].course.fullname,
        },
        expDate: pre[a].formattedtime.replace(/<[^>]*>/g, ""),
        status: false,
        _user: user,
      });
    }
  }
  // Store newly fetched assignments in the database
  await assignmentService.storeAssignments(finalAssignments);

  return res.status(200).send({
    success: true,
    message: "Assignments fetched from moodle and stored in database",
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
  //Fetch the user
  let user = await userService.getUserByID(req.decodedToken._id);
  //Create folder (if it does exist) of the user
  if (!fs.existsSync("app_api/files/" + user._id)) {
    fs.mkdirSync("app_api/files/" + user._id);
  }
  //Save submission file
  fs.writeFile(
    "app_api/files/" + user._id + "/" + req.body._assignment + ".html",
    pretty(req.body.content),
    (err, data) => {
      if (err) {
        return res.status(500).send({
          success: false,
          message: "Error",
        });
      }
    }
  );
  /**
   * Save submission to the database.
   * First check if the submission doc exists, if it does do nothing, otherwise, store it in database
   */
  let sub = await assignmentService.fetchSub(req.body._assignment, user._id);
  //If submission does not exist in the database, store it
  if (sub.length === 0) {
    await assignmentService.storeSubmissionInDB(
      req.body._assignment,
      "app_api/files/" + user._id + "/" + req.body._assignment + ".html",
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
  await assignmentService.markAsDone(req.params.id);
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
  let filePath = "app_api/files/" + user._id + "/" + req.params.id + ".html";
  let pdfFilePath = "app_api/files/" + user._id + "/" + req.params.id + ".pdf";
  let file = fs.readFileSync(filePath, "utf8");
  //Convert to PDF
  await assignmentService.convertPDF(file, pdfFilePath);
  // Upload to moodle
  // Upload to the user's persistent draft area
  await assignmentService.uploadToMoodle(pdfFilePath, user.moodleToken);
  return res.status(200).send({
    success: true,
    message: "File Uploaded",
  });
  //Upload it to the assignment

  //Delete it from the user's private files
});
module.exports = router;
