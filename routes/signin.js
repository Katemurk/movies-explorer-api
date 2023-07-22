const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();

const { login } = require('../controllers/users');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().pattern(/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/),
    password: Joi.string().required().min(8),
  }),
}), login);

module.exports = router;
