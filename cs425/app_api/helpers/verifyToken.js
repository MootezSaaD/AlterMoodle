const jwt = require("jsonwebtoken");

function extractBearer(headers) {
  const token =
    headers.authorization === undefined
      ? undefined
      : headers.authorization.replace("Bearer ", "");
  return token;
}

function verifyJwt(req, res, next) {
  const token = extractBearer(req.headers);
  if (!token)
    return res.status(403).send({
      success: false,
      message: "Invalid JWT"
    });

  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if (err) {
      return res.status(401).send({
        success: false,
        message: "Could not verify JWT"
      });
    }
    req.decodedToken = decodedToken;
    next();
  });
}

module.exports = {
  verifyJwt: verifyJwt
};
