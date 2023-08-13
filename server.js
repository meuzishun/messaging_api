const app = require('./app');
const { connectDB } = require('./database');

connectDB().then(() => {
  app.listen(3000, () => console.log('Server listening on port 3000'));
});
