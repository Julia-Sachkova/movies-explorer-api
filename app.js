require('dotenv').config();
const express = require('express');
const { errors, celebrate, Joi } = require('celebrate');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { login, createUser } = require('./controllers/user');
const NotFound = require('./errors/NotFound');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const limiter = require('./middlewares/limiter');

const app = express();
const { PORT = 3000 } = process.env;

app.use(cors());

mongoose.connect('mongodb://localhost:27017/bitfilmsdb', { useNewUrlParser: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.use(limiter);
app.use(helmet());

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);

app.use(require('./routes/user'));
app.use(require('./routes/movie'));

app.all('*', (_req, _res, next) => {
  next(new NotFound('Страница не найдена'));
});

app.use(errorLogger);

app.use(errors());
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? `На сервере произошла ошибка ${err}`
        : message,
    });
  next();
});

app.listen(PORT);
