const Router = require("express").Router;
const { verifyJwt } = require("../../helpers/verifyToken");
const moment = require("moment");
const _ = require("lodash");
const fs = require("fs");
const router = Router({
  mergeParams: true,
});

router.post("/calendar/save", verifyJwt, async (req, res) => {
  let events = req.body.events;
  let finalEvents = [];
  events.forEach((event) => {
    finalEvents.push(JSON.parse(event));
  });
  console.log(finalEvents);

  // Save events in JSON files:
  // *  Each file represents a day.
  // Note that data coming from the front end will always
  // contain the most updated versions.

  // Join events by dates
  let grouped = _.groupBy(finalEvents, function (event) {
    return new Date(event.start).getDay();
  });
  // Save events in the user's files folder
  //Create folder (if it does exist) of the user
  if (!fs.existsSync("app_api/files/" + req.decodedToken._id + "/calendar")) {
    fs.mkdirSync("app_api/files/" + req.decodedToken._id + "/calendar");
  }
  for (let day in grouped) {
    let dayEvents = grouped[day];
    // Create File (will be overriden in next save)
    fs.writeFileSync(
      "app_api/files/" + req.decodedToken._id + "/calendar/" + day + ".json",
      ""
    );
    // Create a stream
    let stream = fs.createWriteStream(
      "app_api/files/" + req.decodedToken._id + "/calendar/" + day + ".json",
      { flags: "a" }
    );
    dayEvents.forEach((event) => {
      stream.write(JSON.stringify(event) + "\n");
    });
  }
  // Return the saved events
  return res.status(200).send({
    success: true,
    message: "Calendar has been saved",
  });
});
module.exports = router;
