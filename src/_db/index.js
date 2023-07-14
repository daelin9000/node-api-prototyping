/* const sqlite = require('better-sqlite3');

const databasePath = join(__dirname, 'files', 'database.db');

const db = sqlite(databasePath);
db.pragma('journal_mode = WAL');

module.exports = { db }; */

//'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
//const env = process.env.NODE_ENV || 'development';
//const config = require(__dirname + '/../../../config/lib/database.js')[env];
const db = {};

/* let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
} */
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, 'files', 'database.db')
});

// read in models
fs.readdirSync(__dirname + '/models')
  .filter((file) => {
    return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, 'models', file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

sequelize.initTables = async () => {
  for (const modelName of Object.keys(db)) {
    if (db[modelName].init) {
      await db[modelName].initTable(sequelize);
    }
  }
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;