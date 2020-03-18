require("dotenv").config();
const User = require("../models/User");
const authBasic = require("../helpers/authBasic");
const bcrypt = require("bcryptjs");

function userService() {
  // Search for user by email
  async function getUserByEmail(email) {
    const query = { email: email };
    return User.findOne(query);
  }
  // Seach for user by id
  async function getUserByID(userID) {
    return User.findById(userID);
  }
  // Login User Service
  async function login(email, password) {
    const user = await getUserByEmail(email);
    if (!user) {
      throw new Error("User is not registered");
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error("Wrong password");
    }
    const userToken = await authBasic.createTokens(
      user,
      process.env.JWT_SECRET,
      process.env.TOKEN_EXPIRATION
    );
    let userObj = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      moodleToken: user.moodleToken,
      userToken
    };
    return userObj;
  }
  // User Signup Service
  async function signup(userCreds) {
    try {
      const hashedPassword = await bcrypt.hash(userCreds.password, 10);
      const user = await User.create({
        ...userCreds,
        password: hashedPassword
      });
      console.log(user);
      if (!user) {
        throw new Error("User cannot be created");
      }
      return user;
    } catch (error) {
      if (error.code === 11000) {
        throw new Error("User already exists !");
      } else {
        throw error;
      }
    }
  }
  return { login, signup, getUserByID };
}

module.exports = userService;
