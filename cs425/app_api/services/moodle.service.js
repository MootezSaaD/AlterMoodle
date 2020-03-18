require("dotenv").config();
const userService = require("../services/auth.service")();
const moodle = require("moodle-client");
const User = require("../models/User");

function moodleService() {
  // Get user's moodle id
  async function getUserMoodleID(userID) {
    const user = await userService.getUserByID(userID);
    moodle
      .init({
        wwwroot: process.env.MOODLE_URL,
        token: user.moodleToken
      })
      .then(function(client) {
        return client
          .call({
            wsfunction: "core_webservice_get_site_info"
          })
          .then(async function(info) {
            user.moodleUserID = info.userid;
            await user.save();
            return;
          });
      })
      .catch(function(err) {
        console.log("Unable to initialize the client: " + err);
      });
  }
  return { getUserMoodleID };
}

module.exports = moodleService;
