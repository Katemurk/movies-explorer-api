const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // импортируем модуль jsonwebtoken
const User = require('../models/user');

const NotFoundErr = require('../errors/not-found-err');
const ConflictErr = require('../errors/conflict-err');
const BadRequestErr = require('../errors/bad-request-err');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, email, password: hash,
      })
        .then((user) => {
          res.status(201).send({
            name, email, user: user._id,
          });
        })
        .catch((err) => {
          if (err.name === 'ValidationError') {
            return next(new BadRequestErr('Uncorrect creating'));
          } if (err.code === 11000) {
            return next(new ConflictErr('User already exists!'));
          }
          return next(err);
        });
    });
};

const updateUserinfo = (req, res, next) => {
  const { name, email } = req.body;
  const userId = req.user._id;
  return User.findByIdAndUpdate(
    userId,
    { name, email },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundErr('User not found');
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictErr('User with this email already exists!'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestErr('Uncorrect information'));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  const userId = req.user._id;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundErr('User not found');
      }
      return res.status(200).send(user);
    })
    .catch(next);
};

module.exports = {
  createUser,
  updateUserinfo,
  getUser,
  login,
};
