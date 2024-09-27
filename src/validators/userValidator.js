const Joi = require('joi');


const userSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});


const mealSchema = Joi.object({
  name: Joi.string().min(3).required(),
  description: Joi.string().required(),
  dateTime: Joi.date().required(),
  inDiet: Joi.boolean().required(),
});

module.exports = { userSchema, mealSchema };
