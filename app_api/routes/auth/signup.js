const Router = require("express").Router;
const { signupValidation } = require("../../validators/joiValidator");
const authService = require("../../services/auth.service")();

const router = Router({
  mergeParams: true
});

// Signup
router.post("/signup", async (req, res, next) => {
  try {
    // Validating the user's reponse before creating and storing the user
    signupValidation(req.body);
    // Creating the user
    const user = await authService.signup(req.body);
    res.status(201).send({
      success: true,
      message: "You have been successfully registered"
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
