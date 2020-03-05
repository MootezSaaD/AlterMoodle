const Joi = require('@hapi/joi');

// Signup Validation
const signupValidation = data => {
    const schema = Joi.object({
        firstName: Joi
            .string()
            .min(2)
            .required(),
        lastName: Joi
            .string()
            .min(2)
            .required(),
        email: Joi
            .string()
            .min(6)
            .required()
            .email(),
        password: Joi
            .string()
            .min(6)
            .required(),
        moodleToken: Joi
            .string()
            .required()
    });
    return schema.validate(data);
}

// Login Validation
const loginValidation = data => {
    const schema = Joi.object({
        email: Joi
            .string()
            .min(6)
            .required(),
        password: Joi
            .string()
            .min(6)
            .required()
    });
    return schema.validate(data);
}


module.exports.signupValidation = signupValidation;
module.exports.loginValidation = loginValidation;