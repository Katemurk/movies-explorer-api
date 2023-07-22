const signupRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { createUser } = require('../controllers/users');

signupRouter.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    // eslint-disable-next-line no-useless-escape
    email: Joi.string().required().pattern(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/),
    password: Joi.string().required().min(8),
  }),
}), createUser);

module.exports = signupRouter;
