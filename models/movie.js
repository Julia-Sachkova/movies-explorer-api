const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Некорректная ссылка на постер',
      },
      required: true,
    },
    trailerLink: {
      type: String,
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Некорректная ссылка на трейлер',
      },
      required: true,
    },
    thumbnail: {
      type: String,
      validate: {
        validator: (v) => validator.isURL(v),
        message: 'Некорректная ссылка на мини-постер',
      },
      required: true,
    },
    owner: {
      type: String,
      required: true,
    },
    movieId: {
      type: Number,
      required: true,
    },
    nameRU: {
      type: String,
      required: true,
    },
    nameEN: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('movie', movieSchema);
