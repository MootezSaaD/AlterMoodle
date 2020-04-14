const Joi = require("@hapi/joi");

const handleJoiError = (joiObject) => {
  if (joiObject.error)
  throw new Error(joiObject.error.details[0].message);
}


// Signup Validation
const signupValidation = data => {
  const schema = Joi.object({
    firstName: Joi.string()
      .min(2)
      .required(),
    lastName: Joi.string()
      .min(2)
      .required(),
    email: Joi.string()
      .min(6)
      .required()
      .email(),
    password: Joi.string()
      .min(6)
      .required(),
    moodleToken: Joi.string().required()
  });
  return handleJoiError(schema.validate(data));
};

// Login Validation
const loginValidation = data => {
  const schema = Joi.object({
    email: Joi.string()
      .min(6)
      .required(),
    password: Joi.string()
      .min(6)
      .required()
  });
  return handleJoiError(schema.validate(data));
};

//New password validation
const resetPasswordValidation = data => 
  {
    const schema = Joi.object(
      {
        newPassword : Joi.string().min(6).required()

        })
    return handleJoiError(schema.validate(data));
  }

module.exports.signupValidation = signupValidation;
module.exports.loginValidation = loginValidation;
module.exports.resetPasswordValidation = resetPasswordValidation;