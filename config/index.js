require('dotenv').config();

//const databaseConfig = require('./database');

module.exports = {
  web: {
    port: process.env.WEB_APP_PORT || 6969,
    host: process.env.WEB_APP_HOST || '0.0.0.0',
  },
  logging: {
    level: 'INFO',
  },
  //db: databaseConfig,
};