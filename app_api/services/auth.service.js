require("dotenv").config();
const User = require("../models/User");
const authBasic = require("../helpers/authBasic");
const moodleService = require("../services/moodle.service")();
const userSerivce = require("../services/user.service")();
const bcrypt = require("bcryptjs");
const { ErrorHandler } = require("../helpers/errorHandler");

function authService() {
  // Login User Service
  async function login(email, password) {
    const user = await userSerivce.getUserByEmail(email);
    if (!user) {
      throw new Error("User is not registered");
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new ErrorHandler(401, "Wrong password");
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
      courses: user.courses,
      userToken
    };
    return userObj;
  }
  // User Signup Service
  async function signup(userCreds) {
    try {
      const hashedPassword = await bcrypt.hash(userCreds.password, 10);
      const userid = await moodleService.getUserMoodleID(userCreds.moodleToken);
      const courses = await moodleService.getUsersCourses(
        userid,
        userCreds.moodleToken
      );
      if (!userid) {
        throw new ErrorHandler(422, "Invalid MoodleToken, please retry again");
      }
      const user = await User.create({
        ...userCreds,
        password: hashedPassword,
        userid,
        courses
      });

      if (!user) {
        throw new ErrorHandler(500, "User cannot be created");
      }

      return user;
    } catch (error) {
      console.log(error);
      if (error.code === 11000) {
        throw new ErrorHandler(
          409,
          Object.keys(error.keyValue)[0] + " already exists"
        );
      } else {
        throw error;
      }
    }
  }
  return { login, signup };
}

module.exports = authService;
