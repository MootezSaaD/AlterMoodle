const jwt = require('jsonwebtoken');

const createTokens = async(user, appSecret, expiration) => {
    const accessToken = jwt.sign({
            _id: user._id,
        },
        appSecret, {
            expiresIn: expiration
        });

    return Promise.resolve(accessToken);
};

module.exports = {
    createTokens: createTokens
};