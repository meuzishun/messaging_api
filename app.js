const express = require('express');
const genKeyPair = require('./lib/generateKeyPair');
const routes = require('./routes/index');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
genKeyPair();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', routes);
app.use(errorHandler);

module.exports = app;
