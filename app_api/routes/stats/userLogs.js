const Router = require("express").Router;
const { verifyJwt } = require("../../helpers/verifyToken");
const statsService = require("../../services/stats.service")();
const UserLog = require("../../models/UserLog");
const moment = require("moment");

const router = Router({
  mergeParams: true,
});

// Logs when the user enters the dashboard
router.get("/record/log", verifyJwt, async (req, res) => {
  const day = moment().format("dddd"); // Sunday
  const monthYr = moment().format("MMM Do YYYY"); // May 3rd 2020
  const time = moment().format("LT"); // e.g 2:21 PM
  const log = await UserLog.create({
    timeInt: Date.now(),
    day,
    monthYr,
    time,
    _user: req.decodedToken._id,
  });
});

router.get("/fetch/logs", verifyJwt, async (req, res) => {
  const logs = await statsService.fetchUserLogs(req.decodedToken._id);
  return res.status(200).send(logs);
});

module.exports = router;
