const Joi = require('@hapi/joi');


const validateUserReg = (request) => {
    const schema = Joi.object({
        name: Joi.string().required().min(5).max(255),
        email: Joi.string().required().regex(/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/),
        password: Joi.string().required().min(5).max(255),
    });

    return schema.validate(request);
}

module.exports = { validateUserReg };