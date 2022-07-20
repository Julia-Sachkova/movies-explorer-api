const limit = require('express-rate-limit');

const limiter = limit({
  windowsMs: 15 * 60 * 1000,
  max: 100,
});

module.exports = limiter;
