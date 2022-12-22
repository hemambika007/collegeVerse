const Joi = require('joi');
const { number } = require('joi');

module.exports.centreSchema = Joi.object({
    centre: Joi.object({
       question: Joi.string().required(),
        image: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});

module.exports.statusSchema = Joi.object({
    status: Joi.object({
        // rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})