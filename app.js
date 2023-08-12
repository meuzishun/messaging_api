const express = require('express');
const { authRoutes, messagesRoutes } = require('./routes/index');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', authRoutes);
app.use('/messages', messagesRoutes);

app.listen(3000, () => console.log('Server listening on port 3000'));
