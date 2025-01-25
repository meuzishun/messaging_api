require('dotenv').config();
require('./lib/generateKeyPair');
const app = require('./app');
const { connectDB } = require('./config/database');

connectDB().then(() => {
  app.listen(process.env.PORT, () =>
    console.log(`Server listening on port ${process.env.PORT}`)
  );
});
