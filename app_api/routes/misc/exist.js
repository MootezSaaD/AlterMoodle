const Router = require("express").Router;
const userSerivce = require("../../services/user.service")();

const router = Router({
  mergeParams: true
});

router.post("/check-email", async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await userSerivce.getUserByEmail(email);
    if (user) {
      res.status(409).send({
        userExists: true
      });
    }
    res.status(200).send({
      userExists: false
    });
  } catch (err) {
    next(err);
  }
});

router.post("/check-token", async (req, res, next) => {
  try {
    const { moodleToken } = req.body;
    const user = await userSerivce.getUserByMoodleToken(moodleToken);
    if (user) {
      res.status(409).send({
        userExists: true
      });
    }
    res.status(200).send({
      userExists: false
    });
  } catch (err) {
    next(err);
  }
});
module.exports = router;
