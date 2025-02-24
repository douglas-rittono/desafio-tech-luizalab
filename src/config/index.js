require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV,
  mongoUri: process.env.MONGO_URI || 'mongodb://admin:secret@localhost:27017',
};

module.exports = config;
