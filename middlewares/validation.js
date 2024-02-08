const { Joi, celebrate } = require("celebrate");

const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

const validateClothingItem = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of "Name" is 2',
      "string.max": 'The maximum length of "Name" is 30',
      "string.empty": 'The "Name" field must be filled in',
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "URL" field must be filled in',
      "string.uri": 'The "URL" field must be a valid url',
    }),
    weather: Joi.string()
      .valid("hot", "warm", "cold")
      .required()
      .messages({ "string.empty": 'The "Weather" field must be filled in' }),
  }),
});

const validateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of "Name" is 2',
      "string.max": 'The maximum length of "Name" is 30',
      "string.empty": 'The "Name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "Avatar" field must be filled in',
      "string.uri": 'The "Avatar" field must be a valid url',
    }),
    email: Joi.string().required().email().messages({
      "string.email": '"Email" field must be email format',
    }),
    password: Joi.string().required(),
  }),
});

const validateLoginUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.email": '"Email" field must be email format',
    }),
    password: Joi.string().required(),
  }),
});

const validateUserAndItemId = celebrate({
  body: Joi.object().keys({
    params: Joi.object().keys({
      itemId: Joi.string().hex().length(24).required(),
    }),
  }),
});

const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      "string.min": 'The minimum length of "Name" is 2',
      "string.max": 'The maximum length of "Name" is 30',
      "string.empty": 'The "Name" field must be filled in',
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": 'The "Avatar" field must be filled in',
      "string.uri": 'The "Avatar" field must be a valid url',
    }),
  }),
});

module.exports = {
  validateClothingItem,
  validateUserInfo,
  validateLoginUser,
  validateUserAndItemId,
  validateUserUpdate,
};
