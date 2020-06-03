const Router = require("express").Router;
const { verifyJwt } = require("../../helpers/verifyToken");
const statsService = require("../../services/stats.service")();
const transcriptService = require("../../services/transcript.service")();
const userService = require("../../services/user.service")();
const router = Router({
  mergeParams: true,
});

// Return the overall progress of the course submissions, i.e return the number of finished/unfinished assignments
// Implement a a doughnut chart in the front end
router.get("/progress/:courseId", verifyJwt, async (req, res) => {
  let query = await statsService.calcCourseProgress(
    parseInt(req.params.courseId),
    req.decodedToken._id
  );
  delete query[0]._id;
  let finalRes = Object.keys(query[0]).map((x) => ({
    name: x,
    value: query[0][x],
  }));
  return res.status(200).send(finalRes);
});

// Returns the grades of a course
router.get("/grades/:courseId", verifyJwt, async (req, res) => {
  let user = await userService.fetchUserByID(req.decodedToken._id);
  let query = await transcriptService.getCourseGrades(
    user.moodleUserID,
    parseInt(req.params.courseId),
    user.moodleToken
  );
  return res.status(200).send(query);
});

// Calculate performance in each course

router.get("/performance", verifyJwt, async (req, res) => {
  // First calculate the avg/duration that
  // the user has spent on AlterMoodle
  let results = await statsService.fetchUserLogs(req.decodedToken._id);
  // Calculate the difference between two consecutive timeStamps
  res.status(200).send(results);
});

module.exports = router;
