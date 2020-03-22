class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const handleError = (err, res) => {
  let { statusCode, message } = err;
  if (!statusCode) {
    statusCode = 500;
  }
  res.status(statusCode).send({
    success: false,
    message
  });
};

module.exports = { ErrorHandler, handleError };
