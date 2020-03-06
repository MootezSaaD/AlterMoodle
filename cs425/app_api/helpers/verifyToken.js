const jwt = require('jsonwebtoken');

function extractBearer(headers) {
    const token = (headers.authorization === undefined) ? undefined : headers.authorization.replace('Bearer ', '');
    return token;
}

function verifyJwt(req, res, next) {
    const token = extractBearer(req.headers);
    if (!token)
        return res.status(401).send({
            success: false,
            message: 'Invalid JWT'
        });
    try {
        const verifiedToken = jwt.verify(token, process.env.JWT_SECRET);
        if (verifiedToken)
            next();
    } catch {
        return res.status(400).send({
            success: false,
            message: 'Something went wrong !'
        })
    }
}

module.exports.verifyJwt = verifyJwt;