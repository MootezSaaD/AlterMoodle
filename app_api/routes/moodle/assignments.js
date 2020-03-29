const Router = require("express").Router;
const { verifyJwt } = require("../../helpers/verifyToken");
const assignmentService = require("../../services/assignment.service")();
const userService = require("../../services/user.service")();
const moodleService = require("../../services/moodle.service")();

const router = Router({
  mergeParams: true
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
          courseName: pre[a].course.fullname
        },
        expDate: pre[a].formattedtime.replace(/<[^>]*>/g, ""),
        status: false,
        _user: user
      });
    }
  }
  // Store newly fetched assignments in the database
  await assignmentService.storeAssignments(finalAssignments);

  return res.status(200).send({
    success: true,
    message: "Assignments fetched from moodle and stored in database"
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

module.exports = router;
