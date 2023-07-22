const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  updateUserinfo,
  getUser,
} = require('../controllers/users');

router.get('/me', getUser);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateUserinfo);

module.exports = router;
