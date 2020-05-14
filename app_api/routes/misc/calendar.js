const Router = require("express").Router;
const { verifyJwt } = require("../../helpers/verifyToken");
const moment = require("moment");
const _ = require("lodash");
const fs = require("fs");
const calendarService = require("../../services/calendar.service")();
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
  // Delete old events (days)
  if (fs.existsSync("app_api/files/" + req.decodedToken._id + "/calendar/")) {
    calendarService.deleteOldEvents(
      "app_api/files/" + req.decodedToken._id + "/calendar/"
    );
  }
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

    fs.writeFileSync(
      "app_api/files/" + req.decodedToken._id + "/calendar/" + day + ".json",
      JSON.stringify(dayEvents, null, 2)
    );
  }
  // Return the saved events
  return res.status(200).send({
    success: true,
    message: "Calendar has been saved",
  });
});

router.get("/calendar", verifyJwt, async (req, res) => {
  // Iterate through files and store their content into an array
  const path = "app_api/files/" + req.decodedToken._id + "/calendar/";
  let content = [];
  let finalResult = [];
  fs.readdirSync(path).forEach((file) => {
    let arr = JSON.parse(fs.readFileSync(path + "/" + file));
    arr.forEach((e) => {
      content.push(e);
    });
  });

  // Correct the date of each event
  finalResult = calendarService.syncDates(content);
  // Return the array
  return res.status(200).send({
    success: true,
    events: finalResult,
  });
});
module.exports = router;
