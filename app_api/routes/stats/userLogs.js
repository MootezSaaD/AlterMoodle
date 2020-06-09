const Router = require("express").Router;
const { verifyJwt } = require("../../helpers/verifyToken");
const UserLog = require("../../models/UserLog");

const router = Router({
  mergeParams: true,
});

// Store Time spent by user
// This date comes from the OnInit() and OnDestroy() of the dashboard
router.post("/record/time", verifyJwt, async (req, res) => {
  // await UserLog.create({
  //   ...req.body,
  //   _user: req.decodedToken._id,
  // });
  console.log("Log Saved From", req.body.activity);
  res.status(200).send({
    success: true,
    message: "Log saved",
  });
});

module.exports = router;
