const Joi = require('@hapi/joi');


const validateUserReg = (request) => {
    const schema = Joi.object({
        name: Joi.string().required().min(5).max(255),
        email: Joi.string().required().regex(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/),
        password: Joi.string().required().min(5).max(255),
    });

    return schema.validate(request);
}

const validateUserLogin = (request) => {
    const schema = Joi.object({
        email: Joi.string().required().regex(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/),
        password: Joi.required(),
    });

    return schema.validate(request);
}

const passwordChange = (request) => {
    const schema = Joi.object({
        password: Joi.string().required().pattern(/^[a-zA-Z0-9]{3,30}$/),
        confirm_password: Joi.any().valid(Joi.ref('password')).required().error((errors) => errors)
    });

    return schema.validate(request);
}

const validateBio = (request) => {
    const schema = Joi.object({
        "gender": Joi.string().required(),
        "country": Joi.string(),
        "age": Joi.string(),
        "stacks": Joi.array(),
        "bio": Joi.string(),
    });

    return schema.validate(request);
}



module.exports = {
    validateUserReg: validateUserReg,
    validateUserLogin: validateUserLogin,
    validateBio: validateBio,
    passwordChange: passwordChange
};