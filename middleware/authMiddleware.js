const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/user');

const pathToKey = path.join(__dirname, '..', '/config/id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');

const authMiddleware = asyncHandler(async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith('Bearer')
  ) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  const token = req.headers.authorization.split(' ')[1];
  const decoded = jwt.verify(token, PRIV_KEY);
  const user = await User.findById(decoded.id).select('-password');

  if (!user) {
    res.status(401);
    throw new Error('Not authorized, no user found');
  }

  req.body.user = user;
  next();
});

module.exports = authMiddleware;
