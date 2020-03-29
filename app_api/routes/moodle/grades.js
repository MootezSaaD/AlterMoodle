const Router = require("express").Router;
const { verifyJwt } = require("../../helpers/verifyToken");
const userService = require("../../services/user.service")();
const transcriptService = require("../../services/transcript.service")();

const router = Router({
  mergeParams: true
});

/**
 * Get user's overall grades
 */
router.get("/grades", verifyJwt, async (req, res) => {
  const user = await userService.getUserByID(req.decodedToken._id);
  console.log("Getting the course Arr", user.moodleUserID);
  const courseArr = await transcriptService.fetchUsersCourses(
    user.moodleUserID,
    user.moodleToken
  );
  const gradesArr = await transcriptService.getUserGrades(
    user.moodleUserID,
    user.moodleToken
  );
  const transcript = await transcriptService.getTranscript(
    courseArr,
    gradesArr
  );
  res.status(200).send(transcript);
});

module.exports = router;
