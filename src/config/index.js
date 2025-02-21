require('dotenv').config({ path: `.env.${process.env.NODE_ENV || 'development'}` });

const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV,
};

module.exports = config;
