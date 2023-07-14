const { QueryTypes, Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `_db/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    static async initTable(db) {
      if (!(await this.checkTable(db))) {
        await this.createTable(db)
      }
    }

    // create table if needed
    static async checkTable(db) {
      const res = await db.query(
        `SELECT name FROM sqlite_master WHERE type = 'table' AND name = 'users'`,
        { type: QueryTypes.SELECT }
      );
    
      return !!res.length;
    }

    static async createTable(db) {
      await db.query(`
        CREATE TABLE users (
          id UUID PRIMARY KEY,
          firstName TEXT NULL,
          lastName TEXT NULL,
          email TEXT NULL,
          deleted BOOL DEFAULT FALSE,
          createdAt DATE NULL,
          updatedAt DATE NULL
        )
      `);
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true
      },
      firstName: DataTypes.STRING,
      lastName: DataTypes.STRING,
      email: DataTypes.STRING,
      deleted: DataTypes.BOOLEAN,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'User',
    },
  );

  return User;
};
