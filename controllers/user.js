const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET = 'dfYSD54hvdhDSH7db5dsbDjg' } = process.env;

const AlreadyExistData = require('../errors/AlreadyExistData');
const NotFound = require('../errors/NotFound');
const NotValidCode = require('../errors/NotValidCode');
const NoAccess = require('../errors/NoAccess');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'SECRET_KEY',
        { expiresIn: '7d' },
      );
      return res.send({ token });
    })
    .catch(() => {
      next(new NoAccess('Ошибка доступа'));
    });
};

module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFound('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      next(err);
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .orFail(new NotFound('Пользователь не найден'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new NotValidCode('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new AlreadyExistData('Пользователь с таким email уже существует');
      } else {
        bcrypt.hash(password, 10)
          .then((hash) => User.create({
            name,
            email,
            password: hash,
          }))
          .then((userData) => res.send({
            name: userData.name,
            email: userData.email,
            _id: userData._id,
          }))
          .catch((err) => {
            if (err.name === 'ValidationError') {
              next(new NotValidCode('Введены некорректные данные'));
            } else if (err.code === 11000) {
              next(new AlreadyExistData('Пользователь с таким email уже существует'));
            } else {
              next(err);
            }
          });
      }
    })
    .catch((err) => {
      next(err);
    });
};
