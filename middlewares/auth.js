const jwt = require('jsonwebtoken');
const NotValidJwt = require('../errors/NotValidJwt');

const { NODE_ENV, JWT_SECRET } = require('../utils/config');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw (res.send({ message: 'Нужна авторизация' }));
  } else {
    const token = authorization.replace('Bearer ', '');
    let payload;

    try {
      payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'SECRET_KEY');
    } catch (err) {
      next(new NotValidJwt({ message: 'Авторизация не успешна' }));
    }

    req.user = payload;
    next();
  }
};

module.exports = auth;
