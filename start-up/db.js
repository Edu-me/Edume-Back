const mongoose = require('mongoose');
require('dotenv').config()
dbDebugger = require('debug')('db')
module.exports = () => {
  mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true
    })
    .then(() => dbDebugger('Connected to MongoDB...'))
    .catch(err => dbDebugger('Could not connect to MongoDB...'));
    }