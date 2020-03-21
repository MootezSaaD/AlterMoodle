/**
 * You don't really need to store the courses, you can always
 * get them from moodle, no need to store them on the db.
 * However, what if the user's moodle goes down ?
 */
const Router = require("express").Router;
const { verifyJwt } = require("../../helpers/verifyToken");
const moodleService = require("../../services/moodle.service")();

const router = Router({
  mergeParams: true
});

// Fetch user's moodle account info
/**
 * Make a call to moodle's core_webservice_get_site_info webservice
 * parse the object (fetch userid)
 * append userid to the mongoose schema
 *
 */
router.post("/getinfo", verifyJwt, async (req, res) => {
  moodleService.getUserMoodleID(req.decodedToken._id);
  res.status(200).send({
    success: true,
    message: "Check Console mate"
  });
});

router.post("/getcourses", verifyJwt, async (req, res) => {
  let courses = await moodleService.getUsersCourses(req.decodedToken._id);
  res.status(200).send({
    success: true,
    message: "Done",
    courses: courses
  });
});

module.exports = router;
