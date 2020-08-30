const Joi = require('joi');

const schema = Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().required()
})

const verifySchema = (data) => {
    return schema.validate(data)
};

module.exports = {
    verifySchema
}