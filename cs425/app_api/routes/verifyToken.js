const jwt = require('jsonwebtoken');

function verifyJwt(req, res, next) {
    const token = req.heaader('auth_token');
    if (!token)
        return res.status(401).send({
            success: false,
            message: 'Invalid JWT'
        });
    try {
        const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (verified)
            req.userAccount = verifiedToken;
    } catch {
        return res.status(400).send({
            success: false,
            message: 'Something went wrong !'
        })
    }
}

module.exports.verifyJwt = verifyJwt;