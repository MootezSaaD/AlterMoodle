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
  return { getUserByEmail, getUserByID };
}

module.exports = userSerivce;
