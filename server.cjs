const mongoose = require('mongoose');
const { Schema, model,connect } = mongoose;

const jwt = require('jsonwebtoken');
const sign = jwt.sign;

const bcrypt = require('bcrypt');const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3001;

const LOCAL_MONGO_URI = 'mongodb://localhost:27017/p2pTransaction_api';

const connectDB = (url) => {
  return mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

connectDB(LOCAL_MONGO_URI)
  .then(() => {
    console.log('Connected to the database');
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Could not connect to the database', error);
  });

app.use(bodyParser.json());

// Import your endpoint definitions from endpoints.js
require('./endpoints.cjs')(app);

module.exports = app;


