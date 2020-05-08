const Router = require("express").Router;
const { verifyJwt } = require("../../helpers/verifyToken");
const statsService = require("../../services/stats.service")();

const router = Router({
  mergeParams: true,
});

router.get("/fetch/logs", verifyJwt, async (req, res) => {
  const logs = await statsService.fetchUserLogs(req.decodedToken._id);
  return res.status(200).send(logs);
});

module.exports = router;
