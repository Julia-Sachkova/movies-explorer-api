const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { login, createUser } = require('../controllers/user');
const auth = require('../middlewares/auth');
const NotFound = require('../errors/NotFound');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

router.use(auth, require('./user'));
router.use(auth, require('./movie'));

router.all('*', (_req, _res, next) => {
  next(new NotFound('Страница не найдена'));
});

module.exports = router;
