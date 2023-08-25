require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./database');

connectDB().then(() => {
  app.listen(process.env.PORT, () =>
    console.log(`Server listening on port ${process.env.PORT}`)
  );
});
