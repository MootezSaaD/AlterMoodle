const router = require('express').Router();
const User = require('../models/User');
const { signupValidation } = require('../validators/joiValidator')


router.post('/singup', async (req, res) => {
  // Validating the user's reponse before creating and storing the user
  const { error } = signupValidation(req.body);
  if ( error ) return res.status(400).send({
    success: false,
    message: error.details[0].message
  });

    // Creating a new user.
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      moodleToken: req.body.moodleToken,
      password: req.body.password
    });
  try {
    const savedUser = await user.save();
    res.send(savedUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/login');

module.exports = router;
