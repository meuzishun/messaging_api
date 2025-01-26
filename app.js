require('dotenv').config();
// if (process.env.NODE_ENV === 'production') {
//   require('./lib/generateKeyPair');
// }
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const helmet = require('helmet');
const RateLimit = require('express-rate-limit');
// const genKeyPair = require('./lib/generateKeyPair');
const routes = require('./routes/index');
const errorHandler = require('./middleware/errorMiddleware');

const limiter = RateLimit({
  windowMs: 1 * 60 * 1000,
  max: 100,
  validate: { xForwardedForHeader: false },
});

const whitelist = [
  'https://meuzishun.github.io/messaging_ui',
  'https://meuzishun.github.io',
  'http://127.0.0.1:5173',
  'http://localhost:5173',
];

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
// genKeyPair();
app.use(cors(corsOptions));

// if (process.env.NODE_ENV === 'Production') {
app.use(limiter);
app.use(compression());
app.use(helmet());
// }

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api', routes);
app.use(errorHandler);

module.exports = app;
