const Movie = require('../models/movie');

const NoAccess = require('../errors/NoAccess');
const NotFound = require('../errors/NotFound');
const NotValidCode = require('../errors/NotValidCode');

module.exports.getMovie = (req, res, next) => {
  const owner = req.user._id;

  Movie.find({ owner })
    .then((movies) => res.send(movies))
    .catch((err) => {
      next(err);
    });
};

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  const owner = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new NotValidCode('Введены некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  const { movieId } = req.params;

  Movie.findById(movieId)
    .orFail(new NotFound('Фильм не найден.'))
    .then((movie) => {
      if (req.user._id !== movie.owner.toString()) {
        throw new NoAccess('Вы не можете удалить данный фильм');
      }

      return movie.remove()
        .then(() => res.send({ messge: 'Фильм  удален' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotValidCode('Введен некорректный id'));
      } else {
        next(err);
      }
    });
};
