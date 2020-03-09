require("dotenv").config();
const User = require('../models/User');
const authBasic = require('../helpers/authBasic');
const bcrypt = require('bcryptjs');

function userService() {
    // Search for user by email
    async function getUser(email) {
        const query = { email: email };
        return User.findOne(query);
    }
    // Login User Service
    async function login(email, password) {
        const user = await getUser(email);
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
    return { login };
}

module.exports = userService;