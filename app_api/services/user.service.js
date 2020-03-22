const User = require("../models/User");

function userSerivce() {
  // Search for user by email
  async function getUserByEmail(email) {
    const query = { email: email };
    return User.findOne(query);
  }
  // Seach for user by id
  async function getUserByID(userID) {
    return User.findById(userID);
  }
  // Seach for user by token
  async function getUserByMoodleToken(token) {
    const query = { moodleToken: token };
    return User.findOne(query);
  }
  return { getUserByEmail, getUserByID, getUserByMoodleToken };
}

module.exports = userSerivce;
