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

module.exports = router;
