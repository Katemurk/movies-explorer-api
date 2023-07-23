const Movie = require('../models/movie');

const NotFoundErr = require('../errors/not-found-err');
const BadRequestErr = require('../errors/bad-request-err');
const ForbiddenErr = require('../errors/forbidden-err');

const getMovie = (req, res, next) => {
  const ownerId = req.user._id;
  Movie.find({ owner: ownerId })
    .then((movie) => res.status(200).send(movie))
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;
  const ownerId = req.user._id;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: ownerId,
  })
    .then((movie) => res.status(201).send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestErr('Uncorrect movie data'));
      }
      return next(err);
    });
};

const deleteMovieById = (req, res, next) => {
  const userId = req.user._id;
  const movieId = req.params._id;
  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundErr('Movie not found');
      }
      if (movie.owner.toString() !== userId) {
        throw new ForbiddenErr('Not enough rights');
      }
      return Movie.deleteOne(req.params.card)
        .then(() => {
          res.status(200).send(movie);
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            return next(new BadRequestErr('Uncorrect movie data'));
          }
          return next(err);
        });
    }).catch(next);
};

module.exports = {
  getMovie,
  createMovie,
  deleteMovieById,
};
