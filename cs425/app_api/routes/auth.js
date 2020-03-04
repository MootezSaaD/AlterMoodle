const router = require("express").Router();
const User = require("../models/User");
const {
  signupValidation,
  loginValidation
} = require("../validators/joiValidator");
const bcrypt = require("bcryptjs");

// Signup
router.post("/signup", async (req, res) => {
  // Validating the user's reponse before creating and storing the user
  const { error } = signupValidation(req.body);
  if (error)
    return res.status(400).send({
      success: false,
      message: error.details[0].message
    });

  // Check whether the user exists or not
  const userEmail = User.findOne({ email: req.body.email });
  if (userEmail)
    return res.status(400).send({
      success: false,
      message: "User already exists"
    });

  // Hashing the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  // Creating a new user.
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    moodleToken: req.body.moodleToken,
    password: hashPassword
  });

  try {
    const savedUser = await user.save();
    res.status(201).send({
      success: true,
      message: "Your account has been registered"
    });
  } catch (err) {
    res.status(400).send({
      success: true,
      message: err
    });
  }
});

// Login
router.post("/login", (req, res) => {
  // Validating the user's reponse before creating and storing the user
  const { error } = loginValidation(req.body);
  if (error)
    return res.status(400).send({
      success: false,
      message: error.details[0].message
    });
  // Check whether the user exists or not
  const userEmail = User.findOne({ email: req.body.email });
  if (!userEmail)
    return res.status(400).send({
      success: false,
      message: "User does not exists"
    });
});

module.exports = router;
