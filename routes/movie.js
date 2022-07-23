const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { linkReg } = require('../utils/constants');

const {
  getMovie,
  createMovie,
  deleteMovie,
} = require('../controllers/movie');

router.get('/movies', getMovie);
router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(linkReg),
    trailerLink: Joi.string().required().pattern(linkReg),
    thumbnail: Joi.string().required().pattern(linkReg),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);
router.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24).required(),
  }),
}), deleteMovie);

module.exports = router;
