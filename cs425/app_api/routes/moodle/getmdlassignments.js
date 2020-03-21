const Router = require("express").Router;
const { verifyJwt } = require("../../helpers/verifyToken");
const moodleService = require("../../services/moodle.service")();

const router = Router({
  mergeParams: true
});

/**
 * Get assignments from moodle (whether finished or not)
 */
router.post("get-moodle-assignments", verifyJwt, async (req, res) => {});

module.exports = router;
