const Router = require("express").Router;
const { verifyJwt } = require("../../helpers/verifyToken");
const statsService = require("../../services/stats.service")();
const transcriptService = require("../../services/transcript.service")();
const userService = require("../../services/user.service")();
const moment = require("moment");
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
router.get("/grades/:courseId", verifyJwt, async (req, res, next) => {
  try {
    let user = await userService.fetchUserByID(req.decodedToken._id);
    let results = await transcriptService.getCourseGrades(
      user.moodleUserID,
      parseInt(req.params.courseId),
      user.moodleToken
    );
    for (let result of results) {
      if (parseFloat(result.grade) === NaN) {
        result.grade = "N/A";
        result.badge = "N/A";
      } else {
        if (parseFloat(result.grade) > 75.0) {
          result.badge = `<span class="badge badge-success">Good</span>`;
        }
        if (
          parseFloat(result.grade) >= 50.0 &&
          parseFloat(result.grade) < 75.0
        ) {
          result.badge = `<span class="badge badge-warning">Moderate</span>`;
        }
        if (parseFloat(result.grade) < 50.0) {
          result.badge = `<span class="badge badge-danger">Alarming</span>`;
        }
      }
    }
    res.status(200).send(results);
  } catch (error) {
    next(error);
  }
});

// Calculate performance in each course

router.get("/time-spent", verifyJwt, async (req, res) => {
  // First calculate the avg/duration that
  // the user has spent on AlterMoodle
  let message = {};
  let totalDurations = 0;
  let totalDays = 0;

  let bubbleData = [
    {
      name: "Time spent",
      series: [],
    },
  ];

  let results = await statsService.fetchUserLogs(req.decodedToken._id);
  for (let log of results) {
    log.totalTimeSpent = parseFloat(
      log.durations.reduce((a, b) => a + b, 0) / 3600000
    ).toPrecision(3);
    delete log.durations;
  }

  for (let obj of results) {
    bubbleData[0].series.push({
      name: obj.day,
      x: obj.day,
      y: parseFloat(obj.totalTimeSpent),
      r: parseFloat(obj.totalTimeSpent),
    });
  }

  // results.forEach((log) => {
  //   totalDurations += log.totalTimeSpent;
  //   totalDays += 1;
  // });
  // let avgDuration = parseFloat(totalDurations / totalDays).toPrecision(2);

  // if (avgDuration >= 1) {
  //   message.perf = "Good";
  //   message.icon = `data-feather="check-circle"`;
  //   message.message = `You are spending ${avgDuration} hours on average on AlterMoodle !`;
  // }

  // if (avgDuration < 1 && avgDuration >= 0.5) {
  //   message.perf = "Moderate";
  //   message.icon = `data-feather="minus-circle"`;
  //   message.message = `You are spending ${avgDuration} hours on average on AlterMoodle !`;
  // }

  // if (avgDuration < 0.5) {
  //   message.perf = "Alarming";
  //   message.icon = `data-feather="alert-circle"`;
  //   message.message = `You are spending ${avgDuration} hours on average on AlterMoodle !`;
  // }

  res.status(200).send(bubbleData);
});

router.get("/avg-time", verifyJwt, async (req, res) => {
  let results = await statsService.fetchUserLogs(req.decodedToken._id);
  let totalDurations = 0;
  let totalDays = 0;

  for (const log of results) {
    totalDurations += log.durations.reduce((a, b) => a + b, 0) / 3600000;
    totalDays++;
  }
  let avgDuration = parseFloat(totalDurations / totalDays).toPrecision(2);

  res.status(200).send([
    {
      name: "Average Time",
      value: parseFloat(avgDuration),
    },
  ]);
});

module.exports = router;
