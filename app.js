const express = require('express');
const { connectDB } = require('./database');
const routes = require('./routes/index');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', routes);

connectDB().then(() => {
  app.listen(3000, () => console.log('Server listening on port 3000'));
});
