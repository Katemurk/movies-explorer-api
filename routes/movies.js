const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();
const {
  getMovie,
  createMovie,
  deleteMovieById,
} = require('../controllers/movies');
// eslint-disable-next-line no-useless-escape
const correctLink = /^https?:\/\/[\w\-\.\/~:\?\#\[\]@!$&'\(\)\*\+,;=]+#?$/;

router.get('/', getMovie);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(correctLink),
    trailer: Joi.string().required().pattern(correctLink),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().pattern(correctLink),
    movieId: Joi.number().required(),
  }),
}), createMovie);

router.delete('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().length(24).hex(),
  }),
}), deleteMovieById);

module.exports = router;
