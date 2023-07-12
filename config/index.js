require('dotenv').config();

//const databaseConfig = require('./database');

module.exports = {
  web: {
    port: process.env.WEB_APP_PORT || 6969,
    listenAddress: process.env.WEB_APP_LISTEN_ADDRESS || 6969,
  },
  logging: {
    level: 'INFO',
  },
  //db: databaseConfig,
};