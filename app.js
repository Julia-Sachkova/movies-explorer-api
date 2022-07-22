const express = require('express');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorsHandler = require('./middlewares/errorsHandler');
const limiter = require('./middlewares/limiter');
const { dataMovies, PORT } = require('./utils/config');

const app = express();

app.use(cors());

mongoose.connect(dataMovies, { useNewUrlParser: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(limiter);
app.use(helmet());
app.use(require('./routes/index'));

app.use(errorLogger);
app.use(errors());
app.use(errorsHandler);
app.listen(PORT);
