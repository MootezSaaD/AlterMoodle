const Router = require("express").Router;
const User = require("../../models/User");
const jwt = require('jsonwebtoken');
const { loginValidation } = require("../../validators/joiValidator");
const bcrypt = require("bcryptjs");


const router = Router({
    mergeParams: true
});
// Login
router.post("/login", async(req, res) => {
    // Validating the user's reponse before creating and storing the user
    const { error } = loginValidation(req.body);
    if (error)
        return res.status(400).send({
            success: false,
            message: error.details[0].message
        });
    // Check whether the user exists or not
    const userAccount = await User.findOne({ email: req.body.email });
    console.log((await userAccount).toJSON());
    if (!userAccount)
        return res.status(400).send({
            success: false,
            message: "User does not exists"
        });
    // Check whether the entered password is valid or not
    const validPassword = await bcrypt.compare(req.body.password, userAccount.password);
    if (!validPassword)
        return res.status(400).send({
            success: false,
            message: "Wrong password"
        });
    // Create and return JWT.
    const token = jwt.sign({
        _id: userAccount._id,
        firstName: userAccount.firstName,
        lastName: userAccount.lastName,
        email: userAccount.lastName,
        moodleToken: userAccount.moodleToken
    }, process.env.JWT_SECRET);

    res.header('auth_token', token);
    return res.status(200).send({
        success: true,
        message: "Welcome !"
    });
});

module.exports = router;