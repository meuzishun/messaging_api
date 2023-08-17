const express = require('express');
const routes = require('./routes/index');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', routes);
app.use(errorHandler);

module.exports = app;
