require("dotenv").config();
const User = require("../models/User");
const authBasic = require("../helpers/authBasic");
const moodleService = require("../services/moodle.service")();
const userSerivce = require("../services/user.service")();
const statsSerivce = require("../services/stats.service")();

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
      userToken,
    };
    // Save user log
    // await statsSerivce.storeUserLogs(user._id);
    return userObj;
  }
  // User Signup Service
  async function signup(userCreds) {
    try {
      const hashedPassword = await bcrypt.hash(userCreds.password, 10);
      const moodleUserID = await moodleService.getUserMoodleID(
        userCreds.moodleToken
      );
      if (!moodleUserID) {
        throw new ErrorHandler(422, "Invalid MoodleToken, please retry again");
      }
      // Stores user's courses moodle ids to be accessed later.
      const courses = await moodleService.getUsersCoursesIDS(
        moodleUserID,
        userCreds.moodleToken
      );

      const user = await User.create({
        ...userCreds,
        password: hashedPassword,
        moodleUserID,
        courses,
      });

      if (!user) {
        throw new ErrorHandler(500, "User cannot be created");
      }
      // // Get courses following the Course Model
      // const fullCourses = await moodleService.getUsersCourses(
      //   moodleUserID,
      //   userCreds.moodleToken,
      //   user._id
      // );
      // // Store the user's enrolled courses (if they already exist then they wont be added)
      // await moodleService.storeCourses(fullCourses);
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
