const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

let User = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    moodleToken: {
        type: String,
        required: true
    },
    hash: String,
    salt: String
});
// Setting the user's password.
User.methods.setPassword = function(password) {
    // Generate randomly a salt.
    this.salt = crypto.randomBytes(16).toString('hex');
    // The hash will be a combination of generated salt
    // and the user's password using pbkdf2Sync.
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
};

// Checking if the entered password is valid or not.
// Generate a hash from the entered password and check 
// whether the output is the same as the user's hash or not.
User.methods.checkPassword = function(password) {
    let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
};

User.methods.generateJwt = function() {
    let exp = new Date();
    exp.setDate(exp.getDate() + 7);
    return jwt.sign({

    });

};

mongoose.model('User', User);