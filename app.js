require('dotenv').config();
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const RateLimit = require('express-rate-limit');
const genKeyPair = require('./lib/generateKeyPair');
const routes = require('./routes/index');
const errorHandler = require('./middleware/errorMiddleware');

const limiter = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 20,
});

const whitelist = ['https://meuzishun.github.io'];

const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};

const app = express();
genKeyPair();

if (process.env.NODE_ENV === 'Production') {
  app.use(limiter);
  app.use(compression());
  app.use(helmet());
  app.use(cors(corsOptions));
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', routes);
app.use(errorHandler);

module.exports = app;

//! I AM A CHANGE
